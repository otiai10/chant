this["HBS"] = this["HBS"] || {};

this["HBS"]["asset/tpl/modal/tip.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n  <h2 class=\"tips tips-title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n  <table>\n    <tbody>\n      <tr>\n        <td class=\"tips desc-title\"></td><td>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n";
  return buffer;
  });

this["HBS"]["asset/tpl/modal/tips.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"tips-header\">\n  <h2>Tips for `CHA<span class=\"highlight\">N</span>T Command`</h2>\n  <p>CHANTでは、特殊なフォーマットの発言をすることでユーザが全ユーザの窓を操作することが可能です。</p>\n</div>\n";
  });