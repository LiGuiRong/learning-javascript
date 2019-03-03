## diff操作

### 有两个分支master和develop，想查看两个分支中commit的区别

- 查看develop中有而master分支没有的commit, ^标识表示没有的意思

> git log develop ^master
> git log master ^develop

- 查看develop分支比master多提交了哪些commit, **显示的是写在后面的分支多出的commit**

> git log master..develop
> git log develop..master

- 查看两个分支有什么不同, **注意此时是三个点**

> git log develop...master

- 在上述情况下，显示出每个提交都是在哪个分支上的

> git log --left-right develop...master

![git-diff]('../image/git-diff.PNG')


### 对比两个分支中同一文件的差异

> git diff branch1 branch2 -- filename


[git 对比两个分支差异](https://blog.csdn.net/u011240877/article/details/52586664/)