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
            message: '初次安装后自动获取, 请勿填写!',
            required: false
        },
        {
            name: 'sndMagic',
            type: 'input',
            alias: 'sndMagic',
            default: userConfig.sndMagic || '',
            message: '初次安装后自动获取, 请勿填写!',
            required: false
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
const ticketRequestConstruct = (email) => {
    return {
        'method': 'GET',
        'url': 'https://www.jianguoyun.com/d/ajax/getLoginCaptcha?un=' + email,
        'headers': {
          'Cookie': 'referrer=https://www.jianguoyun.com/'
        }
    }
}


/*
 * 登录请求
*/
const loginRequestConstruct = (email, password, ticketResponse) => {
    return {
        'method': 'POST',
        'url': 'https://www.jianguoyun.com/d/login',
        'headers': {
          'Host': 'www.jianguoyun.com',
          'Origin': 'https://www.jianguoyun.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          'login_email': email,
          'login_password': password,
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
const uploadRequestConstruct = (sndId, sndMagic, email, encrypt, filename, extname, img) => {
    return {
        'method': 'POST',
        'url': 'https://www.jianguoyun.com/d/ajax/fileops/uploadXHRV2?path=/&dirName=/&sndId=' + sndId + '&sndMagic=' + sndMagic + '&name=' + filename,
        'headers': {
          'Origin': 'https://www.jianguoyun.com',
          'Referer': 'https://www.jianguoyun.com/',
          'Cookie': 'umn=' + email + '; ta=' + encrypt,
          'Content-Type': 'image/' + extname.slice(1)
        },
        body: img
      }
}


const sndRequestConstruct = (email, encrypt) => {
    return {
        'method': 'GET',
        'url': 'https://www.jianguoyun.com/d/ajax/userop/getUserInfo?start=1&_=1644581145082 ',
        'headers': {
          'Cookie': 'referrer=https://www.jianguoyun.com/; umn=' + email + '; ta=' + encrypt,
        }
    }
} 


const getDownloadUrlRequestConstruct = (sndId, sndMagic, filename, email, encrypt) => {
    return options = {
        'method': 'GET',
        'url': 'https://www.jianguoyun.com/d/ajax/dlink?sndId=' + sndId + '&sndMagic=' + sndMagic + '&path=/' + filename + '&forwin=true&_=1644725713878',
        'headers': {
          'Host': 'www.jianguoyun.com',
          'Referer': 'https://www.jianguoyun.com/',
          'Cookie': 'umn=' + email + '; ta=' + encrypt
        }
      }
}


const handle = async (ctx) => {
    // 获取用户配置信息
    const userConfig = ctx.getConfig('picBed.NutStore')
    const email = userConfig.email
    const password = userConfig.password
    const dir = userConfig.dir
    var sndId = userConfig.sndId
    var sndMagic = userConfig.sndMagic
    var encrypt = userConfig.encrypt

    if(!userConfig){
        throw new Error('请配置相关信息!')
    }       

    var ticket
    if(encrypt == ''){
        // 获取登录所需的ticket
        const ticketRequest = ticketRequestConstruct(email)
        const ticketResponse = await ctx.Request.request(ticketRequest)
        const ticketResponseObject = JSON.parse(ticketResponse)
        if(ticketResponseObject.exp){
            ticket = ticketResponseObject
        }
        else{
            ctx.log.error('获取ticket失败, 请检查您的帐号是否被封禁或限制!')
        }    
            
        // 获取加密后的密码
        try{
            const loginRequest = loginRequestConstruct(email, password, ticket)
            await ctx.Request.request(loginRequest, function(err, loginResponse){
                ctx.log.info(loginResponse)
                ctx.log.info(loginResponse.headers)
                if(loginResponse.statusCode == 302){
                    encrypt = loginResponse.headers['set-cookie'][1].split(';')[0].split('=')[1]
                    // 保存设置
                    ctx.saveConfig({
                        'picBed.NutStore': {
                            email: email,
                            password: password,
                            dir: dir,
                            sndId: sndId,
                            sndMagic: sndMagic,
                            encrypt: encrypt
                        }
                    })
                }
                else{
                    ctx.log.error('获取加密密码失败, 请检查您的账户状态!')
                }
            })    
        }
        catch(err){

        }
    }

    if((sndId == '') || (sndMagic == '')){
        // 获取sndId和sndMagic
        const sndRequest = sndRequestConstruct(email, encrypt)
        const sndResponse = await ctx.Request.request(sndRequest)
        const sndResponseObject = JSON.parse(sndResponse)
        if(sndResponseObject.sandboxes){
            for(var i in sndResponseObject.sandboxes){
                if(sndResponseObject.sandboxes[i].name == userConfig.dir){
                    sndId = sndResponseObject.sandboxes[i].sandboxId
                    sndMagic = sndResponseObject.sandboxes[i].magic
                    // 保存设置
                    ctx.saveConfig({
                        'picBed.NutStore': {
                            email: email,
                            password: password,
                            dir: dir,
                            sndId: sndId,
                            sndMagic: sndMagic,
                            encrypt: encrypt
                        }
                    })
                }
            }
        }
        else{
            ctx.log.error('获取sndKey和sndMagic失败, 请稍后重试或手动填写!')
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

            // 上传图片
            const uploadRequest = uploadRequestConstruct(sndId, sndMagic, email, encrypt, fileName + imgList[i].extname, imgList[i].extname, img)
            const uploadResponse = await ctx.Request.request(uploadRequest)
            const uploadResponseObject = JSON.parse(uploadResponse)
            if(uploadResponseObject.tblUrl){
                // 获取下载链接
                const getDownloadUrlRequest = getDownloadUrlRequestConstruct(sndId, sndMagic, fileName + imgList[i].extname, email, encrypt)
                const getDownloadUrlResponse = await ctx.Request.request(getDownloadUrlRequest)
                const getDownloadUrlResponseObject = JSON.parse(getDownloadUrlResponse)
                if(getDownloadUrlResponseObject.url){
                    delete imgList[i].base64Image
                    delete imgList[i].buffer
                    const url = 'https://www.jianguoyun.com' + getDownloadUrlResponseObject.url
                    imgList[i]['imgUrl'] = url
                }
                else{
                    ctx.log.err('获取坚果云图片下载链接失败, 请稍后重试')
                }
            }
            else{
                ctx.log.error('上传文件失败, 请检查文件名称是否规范或文件是否重复上传!')
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
    return ctx
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