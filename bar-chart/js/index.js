"use strict";var _createClass=function(){function a(b,c){for(var g,f=0;f<c.length;f++)g=c[f],g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(b,g.key,g)}return function(b,c,f){return c&&a(b.prototype,c),f&&a(b,f),b}}();function _asyncToGenerator(a){return function(){var b=a.apply(this,arguments);return new Promise(function(c,f){function g(h,j){try{var k=b[h](j),l=k.value}catch(m){return void f(m)}return k.done?void c(l):Promise.resolve(l).then(function(m){g("next",m)},function(m){g("throw",m)})}return g("next")})}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return b&&("object"==typeof b||"function"==typeof b)?b:a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var Tooltip=function(_ref){var a=_ref.x,b=_ref.y,c=_ref.text;return React.createElement("svg",null,React.createElement("filter",{id:"f1"},React.createElement("feGaussianBlur",{stdDeviation:"5"})),React.createElement("text",{x:a,y:b,style:{stroke:"#f5fff5",strokeWidth:20,filter:"url(#f1)"}},c),React.createElement("text",{x:a,y:b,style:{fill:"#050"}},c))},Bars=function(a){function b(c){_classCallCheck(this,b);var f=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,c));return f.showTooltip=function(g){f.setState({hovering:g.target.dataset.date+": $"+d3.format(",")(g.target.dataset.gdp)+" bn",x:Math.min(window.innerWidth-250,0.75*g.target.getAttribute("x")),y:Math.max(40,0.9*g.target.getAttribute("y"))})},f.hideTooltip=function(){f.setState({hovering:!1})},f.state={hovering:!1,x:0,y:0},f.colorScale=d3.scaleLinear().domain([0,f.props.maxValue]).range(["#ab7","#5a1"]).interpolate(d3.interpolateLab),f}return _inherits(b,a),_createClass(b,[{key:"render",value:function render(){var m=this,_props=this.props,c=_props.scales,f=_props.margins,g=_props.data,h=_props.height,j=c.xScale,k=c.yScale,l=g.map(function(n){return React.createElement("rect",{style:{animation:"barEntrance "+(Math.random()+0.5)+"s"},key:n[0],x:j(n[0]),y:k(n[1]),height:h-f.bottom-c.yScale(n[1]),width:j.bandwidth()+1,fill:m.colorScale(n[1]),"data-date":n[0],"data-gdp":n[1],onMouseEnter:m.showTooltip,onMouseLeave:m.hideTooltip})});return React.createElement("svg",null,React.createElement("g",null,l),this.state.hovering&&React.createElement(Tooltip,{x:this.state.x,y:this.state.y,text:this.state.hovering}))}}]),b}(React.Component),Axis=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:"componentDidMount",value:function componentDidMount(){this.renderAxis()}},{key:"componentDidUpdate",value:function componentDidUpdate(){this.renderAxis()}},{key:"renderAxis",value:function renderAxis(){if("x"===this.props.axis){var c=d3.axisBottom().scale(this.props.scale).tickSize(this.props.tickSize).tickSizeOuter(0).tickValues(["Jan 1950","Jan 1960","Jan 1970","Jan 1980","Jan 1990","Jan 2000","Jan 2010"]).tickFormat(function(g){return g.slice(4)});d3.select(this.axisElement).call(c)}else{var f=d3.axisLeft().scale(this.props.scale).tickSize(this.props.tickSize).tickValues([6000,12000]).tickFormat(function(g){return"$"+g/1e3+"k bn"});d3.select(this.axisElement).call(f)}}},{key:"render",value:function render(){var c=this;return React.createElement("g",{className:"axis axis-"+this.props.axis,ref:function ref(f){c.axisElement=f},transform:this.props.translate})}}]),b}(React.Component),Axes=function(_ref2){var a=_ref2.scales,b=_ref2.margins,c=_ref2.height,f=_ref2.width,g={axis:"x",scale:a.xScale,translate:"translate(0, "+(c-b.bottom)+")",tickSize:5},h={axis:"y",scale:a.yScale,translate:"translate("+b.left+", 0)",tickSize:-(f-b.left-b.right)};return React.createElement("g",null,React.createElement(Axis,g),React.createElement(Axis,h))},Chart=function(_ref3){var a=_ref3.height,b=_ref3.width,c=_ref3.data,f={top:0,right:10,bottom:40,left:45},g=d3.max(c.map(function(k){return k[1]})),h=d3.scaleBand().domain(c.map(function(k){return k[0]})).range([f.left+1,b-f.right-1]),j=d3.scaleLinear().domain([0,g+10]).range([a-f.bottom,f.top]);return React.createElement("svg",{width:b,height:a},React.createElement(Axes,{scales:{xScale:h,yScale:j},margins:f,height:a,width:b}),React.createElement(Bars,{scales:{xScale:h,yScale:j},margins:f,data:c,maxValue:g,height:a}))},ChartWrapper=function(a){function b(){_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return c.resizeChart=function(){c.setState({height:Math.max(200,window.innerHeight-175),width:Math.max(100,window.innerWidth-20)})},c.state={height:Math.max(200,window.innerHeight-175),width:Math.max(100,window.innerWidth-20)},c}return _inherits(b,a),_createClass(b,[{key:"componentDidMount",value:function componentDidMount(){window.addEventListener("resize",this.resizeChart)}},{key:"componentWillUnmount",value:function componentWillUnmount(){window.removeEventListener("resize",this.resizeChart)}},{key:"render",value:function render(){return React.createElement(Chart,{height:this.state.height,width:this.state.width,data:this.props.data})}}]),b}(React.Component),App=function(a){function b(c){_classCallCheck(this,b);var f=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,c));return f.state={data:[],status:null},f}return _inherits(b,a),_createClass(b,[{key:"componentDidMount",value:function(){var f=_asyncToGenerator(regeneratorRuntime.mark(function g(){var h,j,k;return regeneratorRuntime.wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return h="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",m.prev=1,m.next=4,fetch(h);case 4:return m.next=6,m.sent.json();case 6:j=m.sent,k=j.data.map(function(n){return[d3.timeFormat("%b %Y")(d3.timeParse("%Y-%m-%d")(n[0])),n[1]]}),this.setState({data:k,status:"loaded"}),m.next=15;break;case 11:m.prev=11,m.t0=m["catch"](1),console.error(m.t0),this.setState({status:"error"});case 15:case"end":return m.stop();}},g,this,[[1,11]])}));return function c(){return f.apply(this,arguments)}}()},{key:"render",value:function render(){return React.createElement("div",null,React.createElement("h1",null,"US Quarterly GDP"),!this.state.status&&React.createElement("h2",{className:"blinking"},"Retrieving data..."),"error"===this.state.status&&React.createElement("h2",null,"An error has occurred. Please try again later."),"loaded"===this.state.status&&React.createElement(ChartWrapper,{data:this.state.data}),React.createElement("footer",null,"For more information, visit the"," ",React.createElement("a",{href:"https://bea.gov/methodologies/index.htm",target:"_blank"},"U.S. Department of Commerce Bureau of Economic Analysis (BEA)")))}}]),b}(React.Component);ReactDOM.render(React.createElement(App,null),document.getElementById("root"));
