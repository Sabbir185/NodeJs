const handleReqRes = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>')

        res.write('<header>')
        res.write('<title> Nodejs </title>')
        res.write('</header>')

        res.write('<body>')
        res.write('<h1>Welcome Nodejs Developer!</h1>')

        res.write('<form action="/create-user" method="POST"> <input type="text" name="username"> <input type="submit" value="Submit"> </form>')
        res.write('</body>')

        res.write('</html>')


        return res.end();
    }

    if (url === '/users') {
        res.write('<html>')

        res.write('<header>')
        res.write('<title> Nodejs </title>')
        res.write('</header>')

        res.write('<body>')
        res.write('<ul> <li>Sabbir Ahmmed</li> <li>Mustakim</li> </ul>')
        res.write('</body>')

        res.write('</html>')
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const user_name = [];
        req.on("data", (chunk) => {
            user_name.push(chunk);
        })

        req.on("end", () => {
            const user_data = Buffer.concat(user_name).toString();
            console.log(user_data.split('=')[1]);
            res.end();
        })
    }

}

module.exports = handleReqRes;