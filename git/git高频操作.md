### fetch操作
从远程参考拉取代码到本地，不会执行merge操作

### pull操作
git pull的作用也是从远程仓库拉取代码到本地，但是不同的是该命令会merge本地代码，可以理解为git pull是git fetch和git merge两个步骤的结合。

### cherry-pick操作 
场景： 将A分支某个commit的内容同步到B分支上。

1) 在A分支执行git reflog 找到需要同步的那个commitId

2) 切换到B分支git checkout B

3) 执行同步操作git cherry-pick commitId

此时，在B分支就可以看到在A分支中提交的内容啦

### merge操作

场景： 将A分支所有commit的内容都同步到B分支。

如果还是使用cherry-pick命名的话那很快就会崩溃的，git给我们提供了另一个非常有用的命令： merge。该命令可以将一个分支的所有内容合并到指定分支上。

1) 切换到B分支git checkout B 

2) 在B分支上执行git merge A

这样就能将B分支的内容合并到A分支中了。

### revert操作
git revert commit_id 命令可以用于撤销某个已经提交的commit

### stash操作
当你在一个分支上开展了一半的工作，突然在另一个分支测试同学提了一个bug需要你紧急处理，这时你得切换到一个新的分支，可是手头上的工作又不想立即提交，此时就可以使用stash命令了。stash有存储的功能。

1）git stash：将当前的修改存储

2）git stash list： 查看当前所有的存储内容

3）git stash apply： 恢复中断的任务，默认将暂存区和工作区的内容都恢复到工作区

4）git stash apply --index: 将工作区的恢复到工作区，暂存区的恢复到暂存区

5）git stash drop stash_id: 删除指定存储

6）git stash pop： 同时恢复存储和清理存储

> git stash apply 命令只是恢复存储的内容，并不会清理

### blame操作
查看文件中每一行代码最近的commit信息,git blame只能用于单个文件

1）git blame file_name: 查看所有

2）git blame -l 1,5 file_name：查看1到5行

3）git blame -l 1,+5 file_name： 查看1开始，长度为5的行数