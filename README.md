# picgo-plugin-NutStore

## 简介

[坚果云](https://www.jianguoyun.com) 是一款已稳定运营8年的同步网盘产品。您可以将电脑上的任意文件夹同步到坚果云，随时随地便捷地访问自己的文件、并安全地保存它们。坚果云目前分为`免费版`、`专业版`和`高级专业版`，详细的介绍请[点击](https://www.jianguoyun.com/s/pricing)。简单来说，免费版用户的权限如下：

- 每月免费上传`1GB`的文件（文件删除仍然计入）
- 每月免费下载`3GB`的文件

==下面这些细节您有必要了解：==

- 上传、下载、访问图片不限制速度

- 当用户将图片上传至坚果云时，坚果云会为每张图片创建一个外链。需要注意的是，该外链指向的图片实际上是原图片经过`压缩算法`处理后的`有损图片`，而`压缩程度`与`图片尺寸`有关，因此请您在使用本插件时不要上传过大的图片
- 经测试，在通过外链访问这些图片时，坚果云似乎`不会计入`下载流量（万一您的文章火了，能有效避免第二天房子是坚果云的了这种情况）

<br>

## 环境搭建

1. `GUI`用户直接搜索`nutstore`下载

   ![image-20220212132534174](https://www.jianguoyun.com/c/tblv2/Grcm-sfruBu59ogi6Ds8xF1dshK2JnS6cOBvXoAuFEvnzekWVqRvhZdsGbr2BbonQD5sqFyn/YQcyzVAiHm81vdLDNSsFUA/l)

<br>

2. 注册[坚果云](https://www.jianguoyun.com/)（如果您没有账号的话）

   ![image-20220212132620495](https://www.jianguoyun.com/c/tblv2/4LNzfu_H_KxvBMdKdx_xQNdXx0SJpbTOmDXoW7cLWNulJxibUqD00tjoEWhyjsfOgcmYtpyi/P2gyfDz0AANvBw1e-hTFxA/l)

<br>

3. 创建文件夹用以存放图片（中文和某些字符传输过程中会出现乱码，请最好使用全英文，如：Image）

   ![image-20220212133038745](https://www.jianguoyun.com/c/tblv2/UKBITtesGIBko3rkHWAX1wG7YCgfYFygmNTQ5nXbf7sV_nR5cFoK_UTnV7vHE6kvVfT2-G5T/Tqd-4lVPxW2Cb-0_UYSfKw/l)

<br>

4. 根据实际情况修改设置

   ![image-20220212132833544](https://www.jianguoyun.com/c/tblv2/CX9b_n28bJ23oygFpSqjwtdG30FYR8ijgnxqdFlWumiA1mg0ESgHroFL5NPZnCnsU5BQG_Rw/CZIWM94sFcCDlDIgXrwNgw/l)

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

### 1. 图片质量压缩有无解决方法？

目前作者正在试图通过`添加冗余数据`和``图像插值``等方法来缓解图片压缩，可能付出的代价为：

- 消耗更多的存储空间
- 上传速度减慢
- 额外的图片失真

最新的进展都会在`Git`上发布，也欢迎您的参与！

<br>

### 2.怎样解决获取 sndId 和 sndMagic 失败？

`sndId`和`sndMagic`的获取依赖于加密后的密码`encrypt`，在极个别情况下（如：账户状态异常、网络不佳）可能会获取失败，此时您可以在设置中清除`encrypt`并重启`picgo`重试。若仍无法解决，请参照问题3.

<br>

### 3.如何手动获取 sndId 和 sndMagic

1. 浏览器登录`坚果云`

2. 进入之前创建好的文件夹，查看浏览器地址栏

   ![image-20220212134325066](https://www.jianguoyun.com/c/tblv2/_jABXqQZXcwW-n_55eSk-1-j8AciquYkGbObKSMpUWW9mptL5yE_9krXY85Ck_TmmtV-edad/4sc_labdoD8GFuj1bdCfcQ/l)

<br>

3. 获取`sndId`和`sndMagic`
