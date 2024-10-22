import React, { Component } from'react';
import './App.css';

//定义一个数组，包含一些示例数据，反映的是我们准备用API获取的数据
const list=[
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'John',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
    },
]

//高阶函数
const isSearched=searchTerm=>item=>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

//可以直接改该文件来改变网站
class App extends Component {

  //构造函数，初始化state,props是父组件传递给子组件的属性
  constructor(props) {
    //调用父类的构造函数，必须要有
    super(props);
    //初始化state
    //state用于组件保存·控制·修改自己的可变状态 
    //属性名与变量名相同时，可以直接list，
    this.state = {
      list: list,
      searchTerm: '',
    };

    //bind方法用于绑定this指针，否则this指针会指向window
    //这个称作类的绑定，可以让方法内的this指向当前实例对象
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(event){
    this.setState({
      searchTerm: event.target.value
    });
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);

    //更新state,必须使用setState方法，不可以直接修改state
    this.setState({list: updatedList});
  }

  //render()方法返回一个jsx元素，该元素同时包含html和JavaScript代码
  render() {
    //声明变量关键字const和let更常见
    return (
      <div className="App">

        <form>
          <input type="text"
            onChange={this.onSearchChange}
          />
        </form>
        {this.state.list.filter(isSearched(this.state.searchTerm)).map(item=>
          {
            return (
              //key是虚拟DOM的唯一标识符，在重新渲染时React会使用它来确定哪些节点需要更新
              //新旧虚拟DOM的key相同时，若内容有变化，React会更新节点内容，否则不会更新
              //若key不一致，React会认为是不同的节点，会创建新的节点，并重新渲染
              <div key={item.objectID}>
                <span><a href='{item.url}'>{item.title}</a></span>
                <span> by {item.author}</span>
                <span> {item.num_comments} comments</span>
                <span> {item.points} points</span>
  
                <span>
                  <button 
                    onClick={()=>this.onDismiss(item.objectID)}
                    type='button'
                  >
                    Dismiss
                  </button>
                </span>
              </div>
            );
          }
        )}

      </div>
    );
  }
}

export default App;
