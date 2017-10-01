'use strict';var _createClass=function(){function a(b,c){for(var g,f=0;f<c.length;f++)g=c[f],g.enumerable=g.enumerable||!1,g.configurable=!0,'value'in g&&(g.writable=!0),Object.defineProperty(b,g.key,g)}return function(b,c,f){return c&&a(b.prototype,c),f&&a(b,f),b}}();function _asyncToGenerator(a){return function(){var b=a.apply(this,arguments);return new Promise(function(c,f){function g(h,j){try{var k=b[h](j),l=k.value}catch(m){return void f(m)}return k.done?void c(l):Promise.resolve(l).then(function(m){g('next',m)},function(m){g('throw',m)})}return g('next')})}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b&&('object'==typeof b||'function'==typeof b)?b:a}function _inherits(a,b){if('function'!=typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var Tooltip=function(_ref){var a=_ref.x,b=_ref.y,c=_ref.info,f=c.time,g=c.place,h=c.name,j=c.year,k=c.nat,l=c.doping,m={left:a+(15>g?0:-250),top:b+(15>g?150:0),background:l?'rgba(255, 200, 200, 0.9)':'rgba(175,220,255, 0.9)'};return React.createElement('div',{className:'tooltip',style:m},React.createElement('p',null,React.createElement('span',{className:'tooltip-title'},g,' - ',h,' - ',k),React.createElement('br',null),'Time: ',f,React.createElement('br',null),'Year: ',j),l&&React.createElement('p',null,React.createElement('span',{className:'blinking'},'Doping Allegations:'),React.createElement('br',null),l))},Circles=function(a){var b=a.scales,c=a.data,f=b.xScale,g=b.yScale,h=c.map(function(j){return React.createElement('circle',{className:j.Doping?'doping':'clean',key:j.Name,cx:f(d3.timeParse('%M:%S')(j.Time)),cy:g(j.Place),r:7,'data-time':j.Time,'data-place':j.Place,'data-name':j.Name,'data-year':j.Year,'data-nat':j.Nationality,'data-doping':j.Doping,'data-url':j.URL,onClick:a.onClick,onMouseEnter:a.onHover,onMouseLeave:a.onExitHover})});return React.createElement('g',null,h)},Axis=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:'componentDidMount',value:function componentDidMount(){this.renderAxis()}},{key:'componentDidUpdate',value:function componentDidUpdate(){this.renderAxis()}},{key:'renderAxis',value:function renderAxis(){if('x'===this.props.axis){var c=d3.axisBottom().scale(this.props.scale).ticks(10).tickSize(this.props.tickSize);d3.select(this.axisElement).call(c)}else{var f=d3.axisLeft().scale(this.props.scale).tickSize(this.props.tickSize);d3.select(this.axisElement).call(f)}}},{key:'render',value:function render(){var c=this;return React.createElement('g',{className:'axis axis-'+this.props.axis,ref:function ref(f){c.axisElement=f},transform:this.props.translate})}}]),b}(React.Component),Axes=function(_ref2){var a=_ref2.scales,b=_ref2.margins,c=_ref2.height,f=_ref2.width,g={axis:'x',scale:a.xScale,translate:'translate(0, '+(c-b.bottom)+')',tickSize:-(c-b.top-b.bottom)},h={axis:'y',scale:a.yScale,translate:'translate('+b.left+', 0)',tickSize:-(f-b.left-b.right)};return React.createElement('g',null,React.createElement(Axis,g),React.createElement(Axis,h))},Chart=function(a){function b(){_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return c.openDopingLink=function(f){f.target.dataset.url?window.open(f.target.dataset.url):f.preventDefault()},c.showTooltip=function(f){c.setState({hovering:f.target.dataset,x:Math.min(window.innerWidth-150,0.9*f.target.getAttribute('cx')),y:Math.max(50,0.9*f.target.getAttribute('cy'))})},c.hideTooltip=function(){c.setState({hovering:!1})},c.state={hovering:null,x:0,y:0},c}return _inherits(b,a),_createClass(b,[{key:'render',value:function render(){var _props=this.props,c=_props.height,f=_props.width,g=_props.data,h={top:10,right:10,bottom:40,left:40},j=d3.extent(g,function(o){return d3.timeParse('%M:%S')(o.Time)}),k=j[0],l=j[1],m=d3.scaleTime(j[0],j[1]).domain([k,l]).range([h.left,f-h.right]),n=d3.scaleLinear().domain([35,1]).range([c-h.bottom,h.top]);return React.createElement('div',null,React.createElement('svg',{width:f,height:c},React.createElement(Axes,{scales:{xScale:m,yScale:n},margins:h,height:c,width:f}),React.createElement(Circles,{scales:{xScale:m,yScale:n},margins:h,data:g,height:c,onClick:this.openDopingLink,onHover:this.showTooltip,onExitHover:this.hideTooltip})),this.state.hovering&&React.createElement(Tooltip,{x:this.state.x,y:this.state.y,info:this.state.hovering}))}}]),b}(React.Component),ChartWrapper=function(a){function b(){_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return c.resizeChart=function(){c.setState({height:window.innerHeight-175,width:window.innerWidth-20})},c.state={height:window.innerHeight-175,width:window.innerWidth-20},c}return _inherits(b,a),_createClass(b,[{key:'componentDidMount',value:function componentDidMount(){window.addEventListener('resize',this.resizeChart)}},{key:'componentWillUnmount',value:function componentWillUnmount(){window.removeEventListener('resize',this.resizeChart)}},{key:'render',value:function render(){return React.createElement(Chart,{height:this.state.height,width:this.state.width,data:this.props.data})}}]),b}(React.Component),App=function(a){function b(c){_classCallCheck(this,b);var f=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,c));return f.state={data:[],status:null},f}return _inherits(b,a),_createClass(b,[{key:'componentDidMount',value:function(){var f=_asyncToGenerator(regeneratorRuntime.mark(function g(){var h,j;return regeneratorRuntime.wrap(function(l){for(;;)switch(l.prev=l.next){case 0:return h='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',l.prev=1,l.next=4,fetch(h);case 4:return l.next=6,l.sent.json();case 6:j=l.sent,this.setState({data:j,status:'loaded'}),l.next=14;break;case 10:l.prev=10,l.t0=l['catch'](1),console.error(l.t0),this.setState({status:'error'});case 14:case'end':return l.stop();}},g,this,[[1,10]])}));return function c(){return f.apply(this,arguments)}}()},{key:'render',value:function render(){return React.createElement('div',null,React.createElement('h1',null,'Cyclist Data'),!this.state.status&&React.createElement('h2',{className:'blinking'},'Retrieving data...'),'error'===this.state.status&&React.createElement('h2',null,'An error has occurred. Please try again later.'),'loaded'===this.state.status&&React.createElement(ChartWrapper,{data:this.state.data}),React.createElement('footer',null,'For more information, visit',' ',React.createElement('a',{href:'https://www.dopeology.org/',target:'_blank'},'Dopeology.org')))}}]),b}(React.Component);ReactDOM.render(React.createElement(App,null),document.getElementById('root'));