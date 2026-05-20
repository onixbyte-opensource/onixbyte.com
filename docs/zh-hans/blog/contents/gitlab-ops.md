---
title: GitLab 运维
---

## 在国际版 GitLab 中设置默认语言为中文

GitLab 在代码中通过 `SWITCHER_MINIMUM_TRANSLATION_LEVEL` 变量将翻译程度低于 90% 的语言过滤了，简体中文为 84%，繁体中文为 83%

可以前往 `/path/to/gitlab/embedded/service/gitlab-rails/app/helpers/preferred_language_switcher_helper.rb` 中将代码修改如下：

```diff title="/path/to/gitlab/embedded/service/gitlab-rails/app/helpers/preferred_language_switcher_helper.rb" 
- SWITCHER_MINIMUM_TRANSLATION_LEVEL = 90
+ SWITCHER_MINIMUM_TRANSLATION_LEVEL = 80
```

随后通过指令 `gitlab-ctl restart` 重启 GitLab 即可。

## 在首页添加备案信息

前往 `/path/to/gitlab/embedded/service/gitlab-rails/app/views/devise/shared/_footer.html.haml` 中，添加如下代码：

```diff
+ = link_to _("你的备案号"), "https://beian.miit.gov.cn/", target: '_blank', class: 'text-nowrap', rel: 'noopener noreferrer'
```

## 升级 GitLab

### 下载 GitLab Global CE 版安装包

从 [GitLab Package 下载页](https://packages.gitlab.com/gitlab/gitlab-ce) 下载 deb 工具包，并使用 scp 等工具将其上传到服务器中。

### 停用内存大户

```shell
gitlab-ctl stop puma
gitlab-ctl stop sidekiq
```

### 执行备份

```shell
# 示例：跳过构建附件和容器镜像仓库，仅备份数据库和代码仓库
sudo gitlab-backup create SKIP=artifacts,registry
```

### 进行安装

```shell
sudo dpkg -i gitlab-package.deb
```
