## 题目描述
给定一个词组，和两个（或多个）文档，分别判断文档是否可以由词组中的词拼接而成，如果可以则返回能拼接成功的词组及所用次数，否则返回无法拼接出文档。例如词组为：'你，我，他，好，世界'，文档1为：'你好世界' ===> '可以拼接，你 1次、好 1次、世界 1次'；文档2为：'世界坏' ===> '无法拼接出'

## 解决办法

大致思路（针对例子）：1、遍历词组，然后判断词是否存在文档中，如果存在就将改词在文档中的起止位置存在数组中，并且根据起始位置排序：词：'好'===> [1,1]

```
function getIntervals(txt, phrases) { //获取索引区间
            let intervals = [];
            phrases.forEach(i => {
                let reg = new RegExp(i, 'g') //全局搜索词组
                for (const match of txt.matchAll(reg)) {
                    intervals.push([match['index'], match['index'] + i.length - 1])
                }
            })
            return intervals.sort((a, b) => a[0] - b[0]);
        }
```

2、这样我们得到一个有序数组[ [ 0,0],[1,1],[2,3] ]，接下来对这个数组进行递归回溯操作，对满足条件的将位置记录下来并进行下一轮递归

```
function getCover(l,intervals){ //l为长度，只返回一个结果
            let res;
            function dfs(start, temp, record) {//start为开始索引，temp为结果数组，record为记录下一个值用作裁剪
                if(res)return; //控制res
                if ((temp.length!=0) && temp[temp.length - 1][1] == l - 1) { //结束条件
                    res = temp.slice();
                    return;
                }
                for (let i = start; i < intervals.length; i++) {
                    if (intervals[i][0] == record) {
                        temp.push(intervals[i]);
                        dfs(i + 1, temp, intervals[i][1] + 1);
                        temp.pop();
                    }
                }
            }
            dfs(0, [], 0);
            return res; //有结果就返回
        }
```

3、通过以上两个阶段，判断是否可以拼接，如果能拼接，就进入下一阶段计算各个词所用次数，可以通过map来记录出现次数，遍历第二阶段获得的结果，出现一个记录+1次数

```
function getFrequency(txt, cover) { //txt为文本，cover为一个区间数组，返回出现次数
            let map = new Map(); //通过map记录出现次数
            cover.forEach(v=>{
                let key = txt.slice(v[0],v[1]+1);
                if(map.has(key)){
                    map.set(key,map.get(key)+1)
                }else{
                    map.set(key,1);
                }
            })
            return map;
        }
```

