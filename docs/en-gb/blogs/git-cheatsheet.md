---
title: Git Cheatsheet
tags:
  - git
  - tips
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## Ignoring Local Modifications to Tracked Files: `git update-index --skip-worktree`

When you need to modify a Git-tracked file locally but don't want those changes to show up in `git status` or in commits (e.g. a local `application-local.yml`, `.env`, or IDE configuration), you can use `--skip-worktree` to make Git ignore local modifications to that file.

### Marking and Unmarking

```bash
# Make Git ignore local modifications to the file
git update-index --skip-worktree <file>

# Unmark the file and track it again
git update-index --no-skip-worktree <file>
```

### Listing Ignored Files

Marked files are shown with an `S` flag in `git ls-files -v`:

```bash
git ls-files -v | grep '^S'
```

### Committing Changes to a Marked File

To commit new changes to the file, unmark it first, commit, then mark it again:

```bash
git update-index --no-skip-worktree <file>
git add <file>
git commit -m "chore: update config"
git update-index --skip-worktree <file>
```

### `--skip-worktree` vs `--assume-unchanged`

Both options stop Git from reporting modifications to tracked files, but they serve different purposes:

| Option               | Purpose                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--assume-unchanged` | A performance optimisation for large files that rarely change; Git may re-track the file once it notices a change |
| `--skip-worktree`    | Deliberately ignore local changes for "keep local modifications, don't commit" scenarios; more persistent         |

So for "ignoring local changes", use `--skip-worktree`.

### Caveats

- `--skip-worktree` only affects the working tree — it is not a permanent ignore. Operations that rewrite the file, such as `git pull`, `git checkout`, or `git stash`, may overwrite your local changes or cause a conflict. If the file is also likely to change upstream, unmark it before pulling.
- It only applies to **tracked** files; for untracked files, use `.gitignore`.

## Stashing Unfinished Work: `git stash`

When you need to switch branches mid-task, use `git stash` to set your working-tree changes aside:

```bash
git stash push -m "work in progress"  # save with a message
git stash -u                          # include untracked files
git stash list                        # list saved stashes
git stash pop                         # restore and drop the stash
git stash apply                       # restore but keep the stash
git stash drop                        # delete a stash
```

## Amending the Latest Commit: `git commit --amend`

When you commit and then realise you forgot a file or want to change the message:

```bash
git add <forgotten-file>
git commit --amend                   # keep the same message, fold in new changes
git commit --amend -m "new message"  # also change the message
```

Note: if the commit has already been pushed, prefer adding a new commit instead of rewriting shared history.

## Undoing Changes: `git restore` and `git reset`

```bash
git restore <file>               # discard unstaged working-tree changes
git restore --staged <file>      # unstage but keep the changes (like git reset HEAD <file>)
git restore --source=HEAD <file> # restore the file to its HEAD version
```

To discard all uncommitted changes (including the staging area):

```bash
git reset --hard HEAD
```

`--hard` also resets the working tree, so double-check that nothing you want to keep would be lost.

## Recovering Lost Commits: `git reflog`

When a commit seems to have vanished after a bad `git reset --hard` or `git rebase`, `reflog` records every place HEAD has been:

```bash
git reflog
git reset --hard HEAD@{2}   # go back to an earlier recorded position
```

As long as the commit still exists in the object database, reflog can get you back to it.

## Bisecting a Regression: `git bisect`

When you don't know which commit introduced a bug, `git bisect` uses binary search to locate it:

```bash
git bisect start
git bisect bad          # the current commit is bad
git bisect good <sha>   # mark a known-good commit
```

Git checks out a midpoint commit; you just mark each as `good` or `bad` until it narrows down the offending commit:

```bash
git bisect good   # or git bisect bad
git bisect reset  # finish and return to your branch
```

## Friendlier History: `git log`

```bash
git log --oneline --graph --decorate --all   # graph view across all branches
git log -S "some-string" --all               # find commits that added/removed a string
git blame <file>                             # show the last modifier of each line
git blame -L 10,20 <file>                    # restrict to a line range
```

## Cleaning Up Untracked Files: `git clean`

```bash
git clean -n -fd   # preview which files would be removed (always run this first)
git clean -fd      # delete untracked files and directories
```

`-n` only shows what would be deleted without deleting it — preview before you execute.

## Picking Commits: `git cherry-pick`

Apply a specific commit from another branch onto your current branch:

```bash
git cherry-pick <sha>
```

## Deleting Merged Local Branches

```bash
git branch --merged | grep -v '\*' | xargs -n 1 git branch -d
```

This deletes all local branches merged into the current branch (except the current one). Preview with `git branch --merged` first.
