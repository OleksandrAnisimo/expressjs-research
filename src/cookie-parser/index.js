const app = require('express')();
const cookieParser = require('cookie-parser');
const credentials = require('../credentials');
// app.use(cookieParser());

//Error: cookieParser("secret") required for signed
//签名cookie需要一个secret
app.use(cookieParser(credentials.cookieSecret));

app.get('/', (req, res) => {
  //1.设置cookie
  // res.cookie('name', 'novaline');

  //2.开启httpOnly后, 在浏览器客户端使用document.cookie获取不到cookie，也不能修改，有助于防范XSS攻击
  // res.cookie('name', 'novaline', { httpOnly: true });

  //3.expires=0，或者不指定expires，cookie是会话cookie，当浏览器关闭时(不是关闭当前标签页)，cookie也会被删除
  // res.cookie('name', 'delete-when-browser-closed', { expires: 0 });

  //4.设置过期时间（绝对时间），过期后自动被删除
  // res.cookie('name', 'novaline', { expires: new Date(Date.now() + 10000), httpOnly: true });
  // 设置过期时间（相对时间）,10秒过期，自动删除
  // res.cookie('name', 'novaline', { maxAge: 10000 });

  //5.设置签名，如果在浏览器客户端使用document.cookie = 'name=xxx'进行修改，服务器端使用req.signedCookies将拿不到值
  // res.cookie('name', 'novaline', { signed: true });

  //6.设置路径，只有在http://localhost:5775/cookie的路径下，浏览器客户端才能拿到cookie
  // res.cookie('name', 'novaline', { path: '/cookie' });

  //推荐配置
  res.cookie('name', 'novaline', {
    httpOnly: true,
    signed: true,
    path: '/'
    //过期时间根据需要设置
    // maxAge: 100000
    //控制cookie关联的域名，注意，不能给cookie设置跟服务器所用域名不同的域名，因为那样它什么也不会做
    // domain: '.domain.com'
  });

  res.sendFile(__dirname + '/index.html');
});

app.get('/cookie', (req, res) => {
  console.log('Cookies:', req.cookies);
  res.json(req.cookies);
});

app.get('/signedCookie', (req, res) => {
  console.log('SignedCookies:', req.signedCookies);
  res.json(req.signedCookies);
});

app.listen(5775);
