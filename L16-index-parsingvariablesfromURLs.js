const replaceTemplate = (temp, product) => {
    // make it regexp and global
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);    
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
    
}

const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////////////
//SERVER //
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// creating server
const server = http.createServer((req, res) => {
    //console.log(req.url);
    //console.log(url.parse(req.url, true));    
    //const pathName = req.url;
    const { query, pathname } = url.parse(req.url, true);
    
    //Overview Page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html'});
                
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        //console.log(cardsHtml);        
        res.end(output);
        
    //Product Page
    } else if(pathname === '/product'){
        //console.log(query);
        res.writeHead(200, { 'Content-Type': 'text/html'});        
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        
    // API Page  
    } else if(pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json'});
        res.end(data);
    
    // Not found Page
    }else {
        res.writeHead(404, { 
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

// now listening to incoming requests
server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to request on port 8000');
})
