[countryflags](https://www.countryflags.com/en/) 升级了爬虫机制，页面现在是动态页面了，仓库里的脚本已不适用。

# flag download

通过nodejs脚本下载 [countryflags](https://www.countryflags.com/en/) 的国旗，并且按照 [ISO_3166-1_alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 命名

# Get Started

- 下载相关依赖 `npm install`
- 执行脚本 `node main.js`， 图片会下载在项目下的`flag`文件夹
- 如果需要压缩图片大小，可以到 [Developer API](https://tinypng.com/developers) 获得开发者API key，然后添加到脚本中。
