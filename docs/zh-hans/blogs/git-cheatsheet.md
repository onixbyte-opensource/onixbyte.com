---
title: Git 使用小贴士
tags:
  - git
  - tips
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## 忽略已跟踪文件的本地改动：`git update-index --skip-worktree`

当你需要在本机修改某个已被 Git 跟踪的文件，但又不希望这些改动出现在 `git status` 或提交里时（比如本地的 `application-local.yml`、`.env`、IDE 配置等），可以使用 `--skip-worktree` 让 Git 忽略该文件的本地改动。

### 标记与取消标记

```bash
# 让 Git 忽略该文件的本地改动
git update-index --skip-worktree <file>

# 取消忽略，恢复对该文件的跟踪
git update-index --no-skip-worktree <file>
```

### 查看所有被忽略的文件

被标记的文件会在 `git ls-files -v` 的输出中以 `S` 标识：

```bash
git ls-files -v | grep '^S'
```

### 提交对已标记文件的改动

如果需要向仓库提交该文件的新改动，需要先取消标记、提交、再重新标记：

```bash
git update-index --no-skip-worktree <file>
git add <file>
git commit -m "chore: update config"
git update-index --skip-worktree <file>
```

### `--skip-worktree` 与 `--assume-unchanged` 的区别

两个选项都能让 Git 不再关注已跟踪文件的改动，但用途不同：

| 选项                 | 用途                                                                         |
| -------------------- | ---------------------------------------------------------------------------- |
| `--assume-unchanged` | 性能优化，适用于几乎不会改变的大型文件；Git 检测到文件变化后可能自动重新跟踪 |
| `--skip-worktree`    | 有意忽略本地改动，适用于「保持本地修改但不上传」的场景，更持久               |

因此，「忽略本地改动」应该使用 `--skip-worktree`。

### 注意事项

- `--skip-worktree` 只影响工作区层面，并不是一个「永久忽略」。在执行 `git pull`、`git checkout`、`git stash` 等可能改写该文件的操作时，本地改动可能会被覆盖或引发冲突。如果该文件在远端也会变化，建议在拉取前先取消标记。
- 它只对**已跟踪**的文件生效；对于未跟踪的文件，请使用 `.gitignore`。

## 暂存未完成的改动：`git stash`

需要临时切换分支时，可以用 `git stash` 把工作区改动保存起来：

```bash
git stash push -m "work in progress"  # 保存并附带备注
git stash -u                          # 连同未跟踪的文件一起保存
git stash list                        # 查看已保存的改动
git stash pop                         # 恢复并删除该条记录
git stash apply                       # 恢复但保留该条记录
git stash drop                        # 删除某条记录
```

## 修正最近一次提交：`git commit --amend`

当你提交后发现忘了加入某些文件、或想修改提交信息时：

```bash
git add <forgotten-file>
git commit --amend                  # 保持原提交信息，合并进新改动
git commit --amend -m "新提交信息"    # 同时修改提交信息
```

注意：如果该提交已经被推送到远端，请改用新增一个提交的方式，避免改写公共历史。

## 撤销改动：`git restore` 与 `git reset`

```bash
git restore <file>               # 丢弃工作区（未暂存）的改动
git restore --staged <file>      # 取消暂存，保留改动（相当于 git reset HEAD <file>）
git restore --source=HEAD <file> # 将文件恢复到 HEAD 版本
```

想彻底丢弃未提交的全部改动（包括暂存区），可以：

```bash
git reset --hard HEAD
```

`--hard` 会连同工作区一并重置，使用前请确认没有需要保留的改动。

## 找回丢失的提交：`git reflog`

误用了 `git reset --hard` 或 `git rebase` 导致提交「消失」时，`reflog` 记录了 HEAD 的所有历史位置：

```bash
git reflog
git reset --hard HEAD@{2}   # 回到 reflog 中记录的某个位置
```

只要提交还在对象库中，就能通过 reflog 找回。

## 二分查找回归：`git bisect`

当某个 bug 不知道从哪个提交引入时，`git bisect` 会通过二分法帮你定位：

```bash
git bisect start
git bisect bad        # 当前提交是有问题的
git bisect good <sha> # 标记一个已知正常的提交
```

Git 会不断切换到一个中间提交，你只需要根据当前状态标记 `good` 或 `bad`，最终会定位到引入 bug 的那个提交：

```bash
git bisect good   # 或 git bisect bad
git bisect reset  # 结束并回到原分支
```

## 更友好的历史记录：`git log`

```bash
git log --oneline --graph --decorate --all   # 以图形方式查看全部分支
git log -S "some-string" --all               # 查找新增或删除某字符串的提交
git blame <file>                             # 查看每行代码的最后修改者
git blame -L 10,20 <file>                    # 只查看指定行范围
```

## 清理未跟踪文件：`git clean`

```bash
git clean -n -fd   # 先预览会被删除的文件（安全起见务必先跑）
git clean -fd      # 删除未跟踪的文件和目录
```

`-n` 表示只展示而不实际删除，建议先预览再执行。

## 精挑细选：`git cherry-pick`

把其他分支上的某个提交应用到当前分支：

```bash
git cherry-pick <sha>
```

## 清理已合并的本地分支

```bash
git branch --merged | grep -v '\*' | xargs -n 1 git branch -d
```

该命令会删除所有已合并进当前分支的本地分支（当前分支除外）。执行前建议先用 `git branch --merged` 预览。
