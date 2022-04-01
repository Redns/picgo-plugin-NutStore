# picgo-plugin-NutStore

![](https://img.shields.io/badge/version-1.1.7-green)

<br>

## 简介

[坚果云](https://www.jianguoyun.com) 是一款已稳定运营8年的同步网盘产品。您可以将电脑上的任意文件夹同步到坚果云，随时随地便捷地访问自己的文件、并安全地保存它们。坚果云目前分为`免费版`、`专业版`和`高级专业版`，详细的介绍请[点击](https://www.jianguoyun.com/s/pricing)。简单来说，免费版用户的权限如下：

- 每月免费上传`1GB`的文件（文件删除仍然计入）
- 每月免费下载`3GB`的文件

<br>

## 插件特性

- 坚果云上传、下载、访问图片均不限制速度
- 该插件获取的图片是`无损的`、`未压缩的`
- 插件获取的图片链接实际上是图片的 `真实下载链接`，而 `markdown` 在加载图片时实际上是通过 `GET` 命令下载图片，因此通过链接访问图片会计入 `下载流量`
- 坚果云目前没有引入 `Referer` 来防盗链，但不代表其未来不会引入，请您提前做好准备

<br>

## 环境搭建

1. `GUI` 用户直接搜索  `nutstore`  下载

   ![image-20220401225114905](http://jing-image.test.upcdn.net/image-20220401225114905.png)

<br>

2. 注册[坚果云](https://www.jianguoyun.com/)（如果您没有账号的话）

   ![image-20220401225154519](http://jing-image.test.upcdn.net/image-20220401225154519.png)

<br>

3. 创建文件夹用以存放图片（中文和某些字符传输过程中会出现乱码，请最好使用全英文，如：Image）

   ![image-20220401225238418](http://jing-image.test.upcdn.net/image-20220401225238418.png)

<br>

4. 根据实际情况修改设置

   ![image-20220401225315310](http://jing-image.test.upcdn.net/image-20220401225315310.png)

   - `坚果云账号`
   - `账户密码`
   - `文件夹`：您上一步创建的文件夹名称
   - `sndId`：坚果云会为您的每个文件夹指定 sndId 和 sndMagic，首次使用该插件时会自动获取
   - `sndMagic`：请参照 sndId
   - `encrypt`：坚果云会将您的账户密码进行加密，首次使用该插件时会自动获取

<br>

5. 点击确定，设置完成！

<br>

## Q & A

### 1. 无法在picgo插件设置中安装/更新插件怎么办？

##### 方法一：手动下载插件包

1. 点击下载插件包，之后解压

   ![image-20220401225356231](http://jing-image.test.upcdn.net/image-20220401225356231.png)

<br>

2. 打开 `picgo`，选择插件设置中的 `导入本地插件`

   ![image-20220401225414522](http://jing-image.test.upcdn.net/image-20220401225414522.png)

<br>

3. 选择第一步解压的插件包文件夹，等待安装完成！

<br>

##### 方法二：更换镜像源

由于作者的插件均发布于`npm`镜像源 `https://registry.npm.org/`，若您的本地镜像源不是上述镜像源，那么您可能无法下载。

1. 打开 `picgo`，选择 `picgo设置`、`设置代理和镜像地址`

   ![image-20220401225500176](http://jing-image.test.upcdn.net/image-20220401225500176.png)

<br>

2. 修改镜像

   ![image-20220401230458745](http://jing-image.test.upcdn.net/image-20220401230458745.png)

<br>

3. 重启 `picgo` 即可！

<br>

### 2. 获取 sndId 和 sndMagic 失败怎么办？

`sndId` 和 `sndMagic`的获取依赖于加密后的密码 `encrypt`，在极个别情况下（如：账户状态异常、网络不佳、启用微信验证登录、……）可能会获取失败，此时您可以在设置中清除 `encrypt` 并重启 `picgo` 重试。若仍无法解决，请参照问题3

<br>

### 3. 如何手动获取 sndId 和 sndMagic

1. 浏览器登录 `坚果云`

2. ![image-20220401225854900](http://jing-image.test.upcdn.net/image-20220401225854900.png)

<br>

3. 获取 `sndId` 和 `sndMagic`

<br>

### 4.上传失败，显示 StatusCodeError400

报错信息示例如下，详情可参考此 [Issuse](https://github.com/Redns/picgo-plugin-NutStore/issues/2)：

![image](http://jing-image.test.upcdn.net/160249468-3aa0a06c-0715-40ea-b0a5-4126a4985f2c.png)

开启微信验证登录的用户会出现此问题，[点击这里](https://www.jianguoyun.com/#/safety) 关闭微信登录验证

![安全选项](http://jing-image.test.upcdn.net/687474703a2f2f6a696e672d696d6167652e746573742e757063646e2e6e65742f32303232303430313134313832332e706e67)
