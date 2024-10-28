import React, { Component } from'react';
import './App.css';

//下面是API相关的变量和函数
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE='https://hn.algolia.com/api/v1';
const PATH_SEARCH='/search';
const PARAM_SEARCH='query=';
const PARAM_PAGE='page=';
const PARAM_HPP='hitsPerPage=';
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
/*
const isSearched=searchTerm=>item=>
item.title.toLowerCase().includes(searchTerm.toLowerCase());
*/

//可以直接改该文件来改变网站
class App extends Component {

  //构造函数，初始化state,props是父组件传递给子组件的属性
  constructor(props) {
    //调用父类的构造函数，必须要有
    super(props);
    //初始化state
    //state用于组件保存·控制·修改自己的可变状态 
    //属性名与变量名相同时，可以直接list，
    //searchKey用于储存单次搜索结果，实现缓存功能
    this.state = {
      results:null,
      searchKey:'',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    //bind方法用于绑定this指针，否则this指针会指向window
    //这个称作类的绑定，可以让方法内的this指向当前实例对象
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  //返回值前面有感叹号表示返回bool值
  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    const {searchKey,results} = this.state;

    const oldHits=results && results[searchKey]?results[searchKey].hits:[];
    const updatedHits = [...oldHits,...hits];
    this.setState({
      results:{...results, [searchKey]:{hits:updatedHits, page}}
    });
  }

  fetchSearchTopStories(searchTerm,page=0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${
  page}&${PARAM_HPP}${DEFAULT_HPP}`)
     .then(response => response.json())
     .then(result => this.setSearchTopStories(result))
     .catch(e=>this.setState({error: e}));
  }

  //组件挂载后，调用fetchSearchTopStories方法，获取初始数据
  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event){
    this.setState({
      searchTerm: event.target.value
    });
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.setState({
      searchKey: searchTerm
    });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    //阻止默认行为，防止页面跳转
    event.preventDefault();
  }
 
  onDismiss(id) {
    const {searchKey,results} = this.state;
    const {hits,page} = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      //扩展运算符，可以把两个数组合并成一个数组
      results:{...results, [searchKey]:{hits:updatedHits, page}}
    });
  }

  //render()方法返回一个jsx元素，该元素同时包含html和JavaScript代码
  render() {
    //解构，让代码更加简洁
    const {searchTerm,results,searchKey,error} = this.state;
    const page = (results && results[searchKey] && results[searchKey].hits) || [];
    if (!results) {return null;}

    //声明变量关键字const和let更常见
    //当我们想要在自己创建的组件中再嵌套其他元素，就会用到children属性
    //Search其实就是<Search>组件里面的{children}，可以改变其显示内容 
    return (
      <div className="page">
        <div className='interactions'>
        <Search
          value={searchTerm}
          onChange={this.onSearchChange} 
          onSubmit={this.onSearchSubmit} 
        >
          Search
        </Search>
        </div>

        {error
          ? <div className='interactions'>
            <p>Something went wrong</p>
          </div>
          : <Table 
          list={page} 
          onDismiss={this.onDismiss} />}

        <div className='interactions'>
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

//当子组件有嵌套的子内容时，才需要从props中解构出children属性
//下面是函数式无状态组件,代码怎么能这么好看啊
const Search = ({value, onChange, onSubmit, children}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">{children}</button>
  </form>

const Table = ({list, onDismiss}) =>
  <div className='table'>
        {list.map(item =>
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
