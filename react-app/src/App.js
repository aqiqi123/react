import React, { Component } from'react';
import './App.css';

//下面是API相关的变量和函数
const DEFAULT_QUERY = 'redux';

const PATH_BASE='https://hn.algolia.com/api/v1';
const PATH_SEARCH='search';
const PARAM_SEARCH='query=';

//组件生命周期顺序
//constructor（）
//componentWillMount（）
//render（）
//componentDidMount（）

//组件更新生命周期
//componentWillReceiveProps（）
//shouldComponentUpdate（）
//componentWillUpdate（）
//render（）
//componentDidUpdate（）

//组件卸载生命周期
//componentWillUnmount（）

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
      result:null,
      searchTerm: DEFAULT_QUERY,
    };

    //bind方法用于绑定this指针，否则this指针会指向window
    //这个称作类的绑定，可以让方法内的this指向当前实例对象
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm) {
    const url = `${PATH_BASE}/${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`;
    fetch(url)
     .then(response => response.json())
     .then(result => this.setSearchTopStories(result))
     .catch(error => console.error(error));
  }

  //组件挂载后，调用fetchSearchTopStories方法，获取初始数据
  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
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
    //解构，让代码更加简洁
    const {searchTerm,result} = this.state;

    if (!result) {return null;}

    //声明变量关键字const和let更常见
    //当我们想要在自己创建的组件中再嵌套其他元素，就会用到children属性
    //Search其实就是<Search>组件里面的{children}，可以改变其显示内容 
    return (
      <div className="page">
        <div className='interactions'>
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}  
        >
          Search
        </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

//当子组件有嵌套的子内容时，才需要从props中解构出children属性
//下面是函数式无状态组件,代码怎么能这么好看啊
const Search = ({value, onChange, children}) =>
  <form>
    {children}
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

const Table = ({list, pattern, onDismiss}) =>
  <div className='table'>
        {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID} className='table-row'>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <Button 
                onClick={() => onDismiss(item.objectID)}
                className='button-inline'
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
  </div>

//可复用组件
//className属性可以给元素添加类名，如果没有就表示空字符串，而不是undefined
const Button = ({onClick,className='', children}) =>
  <button
        onClick={onClick}
        className={className}
        type='button'
  >
      {children}
  </button>

export default App;
