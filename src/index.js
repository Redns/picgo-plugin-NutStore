const config = (ctx) => {
    let userConfig = ctx.getConfig('picBed.NutStore')
    if (!userConfig) {
        userConfig = {}
    }
    const config = [
        {
            name: 'email',
            type: 'input',
            alias: '坚果云帐号',
            default: userConfig.email || '',
            message: '帐号不能为空',
            required: true
        },
        {
            name: 'password',
            type: 'input',
            alias: '账户密码',
            default: userConfig.password || '',
            message: '密码不能为空',
            required: true
        },
        {
            name: 'dir',
            type: 'input',
            alias: '文件夹',
            default: userConfig.dir || '',
            message: '文件夹不能为空',
            required: true
        },
        {
            name: 'sndId',
            type: 'input',
            alias: 'sndId',
            default: userConfig.sndId || '',
            message: 'sndId不能为空!',
            required: true
        },
        {
            name: 'sndMagic',
            type: 'input',
            alias: 'sndMagic',
            default: userConfig.sndMagic || '',
            message: 'sndMagic不能为空!',
            required: true
        },
        {
            name: 'encrypt',
            type: 'input',
            alias: 'encrypt',
            default: userConfig.encrypt || '',
            message: '初次安装后自动获取, 请勿填写!',
            required: false
        }
    ]
    return config
}

/*
 *  获取登录所需要的相关信息请求
 */
const ticketRequestConstruct = (userConfig) => {
    return {
        'method': 'GET',
        'url': 'https://www.jianguoyun.com/d/ajax/getLoginCaptcha?un=' + userConfig.email,
        'headers': {
          'Cookie': 'referrer=https://www.jianguoyun.com/'
        }
    }
}


/*
 * 登录请求
*/
const loginRequestConstruct = (userConfig, ticketResponse) => {
    return {
        'method': 'POST',
        'url': 'https://www.jianguoyun.com/d/login',
        'headers': {
          'Host': 'www.jianguoyun.com',
          'Origin': 'https://www.jianguoyun.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          'login_email': userConfig.email,
          'login_password': userConfig.password,
          'remember_me': 'on',
          'login_dest_uri': '/d/home',
          'custom_ticket': ticketResponse.custom_ticket,
          'exp': `${ticketResponse.exp}`,
          'sig': ticketResponse.sig,
          'reusable': `${ticketResponse.reusable}`
        }
    }
}


/*
 * 上传文件请求
*/
const uploadRequestConstruct = (userConfig, filename, extname, img) => {
    return {
        'method': 'POST',
        'url': 'https://www.jianguoyun.com/d/ajax/fileops/uploadXHRV2?path=/&dirName=/&sndId=' + userConfig.sndId + '&sndMagic=' + userConfig.sndMagic + '&name=' + filename,
        'headers': {
          'Origin': 'https://www.jianguoyun.com',
          'Referer': 'https://www.jianguoyun.com/',
          'Cookie': 'umn=' + userConfig.email + '; ta=' + userConfig.encrypt,
          'Content-Type': 'image/' + extname.slice(1)
        },
        body: img
      }
}


const handle = async (ctx) => {
    // 获取用户配置信息
    const userConfig = ctx.getConfig('picBed.NutStore')
    const email = userConfig.email
    const password = userConfig.password
    const dir = userConfig.dir
    const sndId = userConfig.sndId
    const sndMagic = userConfig.sndMagic

    if(!userConfig){
        throw new Error('请配置相关信息!')
    }       
    if(userConfig.encrypt == ''){
        // 获取登录所需的ticket
        const ticketRequest = ticketRequestConstruct(userConfig)
        const ticketResponse = await ctx.Request.request(ticketRequest)

        // 登录以获取加密后的密码
        try{
            const loginRequest = loginRequestConstruct(userConfig, JSON.parse(ticketResponse))
            await ctx.Request.request(loginRequest, function(error, response){
                if(response.statusCode == 302){
                    // 获取加密后的密码
                    const pass_enc = response.headers['set-cookie'][1].split(';')[0].split('=')[1]

                    // 保存设置
                    ctx.saveConfig({
                        'picBed.NutStore': {
                            email: email,
                            password: password,
                            dir: dir,
                            sndId: sndId,
                            sndMagic: sndMagic,
                            encrypt: pass_enc
                        }
                    })
                }
                else{
                    ctx.log.error('获取加密密码失败, 请检查你的账户状态!')
                }
            })
        }
        catch(err){

        } 
    }

    const imgList = ctx.output
    for(var i in imgList){
        try{
            let img = imgList[i].buffer
            if(!img && imgList[i].base64Image){
                img = Buffer.from(imgList[i].base64Image, 'base64')
            }

            // 格式化图片名称
            var myDate = new Date()
            var fileName = `${myDate.getFullYear()}${myDate.getMonth() + 1}${myDate.getDate()}${myDate.getHours()}${myDate.getMinutes()}${myDate.getSeconds()}`

            const uploadRequest = uploadRequestConstruct(userConfig, fileName + imgList[i].extname, imgList[i].extname, img)
            const uploadResponse = await ctx.Request.request(uploadRequest)
            const response = JSON.parse(uploadResponse)
            if((response.tblUrl != null) && (response.tblUrl != '')){
                delete imgList[i].base64Image
                delete imgList[i].buffer
                const url = 'https://www.jianguoyun.com' + response.tblUrl + '/l'
                    imgList[i]['imgUrl'] = url
                }
                else{
                    ctx.log.error(err)
                }
            }
            catch(err){
                if (err.error === 'Upload failed') {
                    ctx.emit('notification', {
                        title: '上传失败!',
                        body: '请检查你的配置项是否正确'
                    })
                } 
                else {
                    ctx.emit('notification', {
                        title: '上传失败!',
                        body: '请检查你的配置项是否正确'
                    })
                }
                throw err
            }
    }
}


module.exports = (ctx) => {
    const register = () => {
        ctx.log.success('NutStore加载成功！')
        ctx.helper.uploader.register('NutStore', {
            handle: handle,
            config: config,
            name: 'NutStore'
        })
    }
    return {
        register,
        uploader: 'NutStore'
    }
}