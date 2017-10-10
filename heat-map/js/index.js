"use strict";var _createClass=function(){function a(b,c){for(var g,f=0;f<c.length;f++)g=c[f],g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(b,g.key,g)}return function(b,c,f){return c&&a(b.prototype,c),f&&a(b,f),b}}();function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return b&&("object"==typeof b||"function"==typeof b)?b:a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var Legend=function(_ref){var a=_ref.colorScale,b=_ref.height,c=_ref.width,g=[-6.5,-5,-3.5,-2.25,-0.75,0.5,1.75,3,4.25,5.5].map(function(h,j){return React.createElement("rect",{key:"legend-"+h,x:c/10*j,y:0,fill:a(h),height:b,width:c/10})});return React.createElement("div",null,React.createElement("div",{className:"legend",style:{left:(window.innerWidth-c)/2}},React.createElement("svg",{height:b,width:c},React.createElement("g",null,g)),React.createElement("br",null),React.createElement("div",{className:"legend-labels"},React.createElement("span",null,"-6.5"),React.createElement("span",null,"Temp",225>c?". Diff.":"erature Differential"),React.createElement("span",null,"5.5"))),200<c&&500<window.innerHeight&&React.createElement("div",{className:"footer"},"Temp",450>c?". diff. relative to avg. abs. temp. 1/1951 - 12/1980":"erature differentials are relative to the average absolute temperature between Jan 1951 and Dec 1980 (8.66\xB0C +/- 0.07)"))},Tooltip=function(_ref2){var a=_ref2.x,b=_ref2.y,c=_ref2.info,f=c.year,g=c.month,h=c.variance,j=c.fill,k=d3.color(j);k.opacity=0.8;var l={left:a,top:b+(b<window.innerHeight/5?150:0),background:k};return React.createElement("div",{className:"tooltip",style:l},React.createElement("p",null,React.createElement("span",{className:"tooltip-title"},g," ",f),React.createElement("br",null),h))},Cells=function(_ref3){var a=_ref3.scales,b=_ref3.data,c=_ref3.height,f=_ref3.width,g=_ref3.onHover,h=_ref3.onExitHover,j=a.xScale,k=a.yScale,l=a.colorScale,m=b.map(function(n){return React.createElement("rect",{key:n.month+"-"+n.year,x:j(n.year),y:k(n.month),fill:l(n.variance),height:c/12+2,width:f/262,"data-year":d3.timeFormat("%Y")(n.year),"data-month":d3.timeFormat("%b")(n.month),"data-variance":n.variance,"data-fill":l(n.variance),onMouseEnter:g,onMouseLeave:h})});return React.createElement("g",null,m)},Axis=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:"componentDidMount",value:function componentDidMount(){this.renderAxis()}},{key:"componentDidUpdate",value:function componentDidUpdate(){this.renderAxis()}},{key:"renderAxis",value:function renderAxis(){if("x"===this.props.axis){var c=d3.axisBottom().scale(this.props.scale).ticks(d3.timeYear.every(30)).tickSize(0).tickFormat(d3.timeFormat("%Y"));d3.select(this.axisElement).call(c)}else{var f=d3.axisLeft().scale(this.props.scale).tickSize(0).tickFormat(d3.timeFormat(40===this.props.margins.left?"%b":"%B"));d3.select(this.axisElement).call(f)}}},{key:"render",value:function render(){var c=this;return React.createElement("g",{className:"axis axis-"+this.props.axis,ref:function ref(f){c.axisElement=f},transform:this.props.translate})}}]),b}(React.Component),Axes=function(_ref4){var a=_ref4.scales,b=_ref4.margins,c=_ref4.height,f={axis:"x",margins:b,scale:a.xScale,translate:"translate(0, "+(a.yScale(d3.timeParse("%m")(13))+5)+")"},g={axis:"y",margins:b,scale:a.yScale,translate:"translate("+b.left+", "+c/22+")"};return React.createElement("g",null,React.createElement(Axis,f),React.createElement(Axis,g))},Chart=function(a){function b(){_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return c.showTooltip=function(f){c.setState({hovering:f.target.dataset,x:Math.min(window.innerWidth-150,0.9*f.target.getAttribute("x")),y:Math.max(50,0.9*f.target.getAttribute("y"))})},c.hideTooltip=function(){c.setState({hovering:!1})},c.state={hovering:null,x:0,y:0},c}return _inherits(b,a),_createClass(b,[{key:"render",value:function render(){var _props=this.props,c=_props.height,f=_props.width,g=_props.data,h={top:10,right:5,bottom:50,left:521>f?40:80},j=d3.scaleTime().domain([new Date(1753,0,1),new Date(2015,11,31)]).range([h.left,f-h.right]),k=d3.scaleTime().domain([new Date(1900,11,1),new Date(1900,0,1)]).range([c-h.bottom,h.top]),l=d3.scaleQuantile().domain([-6.5,5.5]).range(["#4df","#aef","#dfb","#ffb","#fd8","#fc8","#fa8","#f98","#f44","#c10"]);return React.createElement("div",null,React.createElement("svg",{width:f,height:c+h.bottom},React.createElement(Axes,{scales:{xScale:j,yScale:k},margins:h,height:c,width:f}),React.createElement(Cells,{scales:{xScale:j,yScale:k,colorScale:l},data:g,height:c,width:f,onHover:this.showTooltip,onExitHover:this.hideTooltip})),this.state.hovering&&React.createElement(Tooltip,{x:this.state.x,y:this.state.y,info:this.state.hovering}),React.createElement(Legend,{colorScale:l,margins:h,height:Math.max(40,c/13),width:f/2}))}}]),b}(React.Component),ChartWrapper=function(a){function b(){_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return c.resizeChart=function(){c.setState({height:Math.max(250,window.innerHeight-250),width:Math.max(250,window.innerWidth-30)})},c.state={height:Math.max(250,window.innerHeight-250),width:Math.max(250,window.innerWidth-30)},c}return _inherits(b,a),_createClass(b,[{key:"componentDidMount",value:function componentDidMount(){window.addEventListener("resize",this.resizeChart)}},{key:"componentWillUnmount",value:function componentWillUnmount(){window.removeEventListener("resize",this.resizeChart)}},{key:"render",value:function render(){return React.createElement(Chart,{height:this.state.height,width:this.state.width,data:this.props.data})}}]),b}(React.Component),App=function(a){function b(c){_classCallCheck(this,b);var f=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,c));try{var g=heatMapData.monthlyVariance;g.forEach(function(h){h.year=d3.timeParse("%Y")(h.year),h.month=d3.timeParse("%m")(h.month)}),f.state={data:g}}catch(h){f.state={data:null}}return f}return _inherits(b,a),_createClass(b,[{key:"render",value:function render(){return React.createElement("div",null,React.createElement("h1",null,"Global Surface Temperature"),React.createElement("h2",null,"1753 - 2015"),this.state.data?React.createElement(ChartWrapper,{data:this.state.data}):React.createElement("h3",null,"An error has occurred. Please try again later."))}}]),b}(React.Component);ReactDOM.render(React.createElement(App,null),document.getElementById("root"));
