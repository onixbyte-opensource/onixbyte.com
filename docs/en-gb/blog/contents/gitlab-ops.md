---
title: GitLab Operations
tags:
  - gitlab
  - devops
---

## Setting the Default Language to Chinese in GitLab

GitLab filters out languages with less than 90% translation coverage via the `SWITCHER_MINIMUM_TRANSLATION_LEVEL` variable in the code. Simplified Chinese sits at 84% and Traditional Chinese at 83%.

Navigate to `/path/to/gitlab/embedded/service/gitlab-rails/app/helpers/preferred_language_switcher_helper.rb` and modify the code as follows:

```diff title="/path/to/gitlab/embedded/service/gitlab-rails/app/helpers/preferred_language_switcher_helper.rb" 
- SWITCHER_MINIMUM_TRANSLATION_LEVEL = 90
+ SWITCHER_MINIMUM_TRANSLATION_LEVEL = 80
```

Then restart GitLab with `gitlab-ctl restart`.

## Adding ICP Filing Information to the Homepage

Navigate to `/path/to/gitlab/embedded/service/gitlab-rails/app/views/devise/shared/_footer.html.haml` and add the following:

```diff
+ = link_to _("Your ICP Filing Number"), "https://beian.miit.gov.cn/", target: '_blank', class: 'text-nowrap', rel: 'noopener noreferrer'
```

## Upgrading GitLab

### Downloading the GitLab CE Package

Download the deb package from the [GitLab Package page](https://packages.gitlab.com/gitlab/gitlab-ce) and transfer it to the server using `scp` or a similar tool.

### Stopping Memory-Intensive Services

```shell
gitlab-ctl stop puma
gitlab-ctl stop sidekiq
```

### Running a Backup

```shell
# Example: skip build artefacts and container registry, backing up only the database and repositories
sudo gitlab-backup create SKIP=artifacts,registry
```

### Installing

```shell
sudo dpkg -i gitlab-package.deb
```
