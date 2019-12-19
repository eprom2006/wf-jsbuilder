'use strict';
var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('jsbuilder');
});

router.get('/:dir.js', function(req, res) {
    let path = "jsbuilder/".concat(req.params.dir);

    function dirwalker(path, fininshed) {
        // console.log({
        //     pos: "dirwalker",
        //     path: path
        // });
        fs.readdir(path, { withFileTypes: true }, function(err, items) {
            if (!err) {


                //console.log(items);
                var dirs = [];
                var i = 0;
                var j = 0;
                walker();

                function walker() {
                    if (i < items.length) {
                        var item = items[i];
                        var fullname = path + '/' + item.name;
                        if (item.isFile()) {
                            // console.log({ pos: "isfile", i: i });
                            fs.readFile(fullname, function(err, data) {
                                // console.log({
                                //     pos: "file readed",
                                //     i: i,
                                //     fullname: fullname,
                                //     err: err,
                                //     data: data
                                // });
                                res.write('\n\n//  ' + fullname + '\n\n');
                                res.write(data);
                                i += 1;
                                walker();
                            });
                        } else if (item.isDirectory()) {
                            // console.log({
                            //     pos: "isdir", i: i,
                            //     fullname: fullname
                            // });
                            dirs.push(fullname);
                            i += 1;
                            walker();
                        }
                    } else if (j < dirs.length) {
                        // console.log({
                        //     pos: "dir", j: j,
                        //     fullname: dirs[j]
                        // });
                        dirwalker(dirs[j], function() {
                            j += 1;
                            walker();
                        })

                    } else {
                        fininshed();
                    }
                }
            } else {
                res.status(404);
                res.send("file not found!");
                res.end();
            }
        })

    }

    dirwalker(path, function() { res.end(); });
});



module.exports = router;