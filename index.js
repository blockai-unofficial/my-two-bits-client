module.exports = function(options) {

  var commonWallet = options.commonWallet;

  var serverRootUrl = commonWallet.network === "testnet" ? "https://my-two-bits-test.blockai.com" : "https://my-two-bits.blockai.com";

  var get = function(sha1, callback) {
    commonWallet.login(serverRootUrl, function(err, res, body) {
      commonWallet.request({host: serverRootUrl, path: "/comments/" + sha1 }, function(err, res, body) {
        if (err || !body || res.statusCode >= 400) {
          return callback(res.statusCode, false);
        }
        var comments = JSON.parse(body);
        callback(false, comments);
      });
    });
  }

  var post = function(sha1, commentBody, callback) {
    commonWallet.login(serverRootUrl, function(err, res, body) {
      commonWallet.signMessage(commentBody, function(err, signedCommentBody) {
        commonWallet.request({
          host: serverRootUrl, 
          path: "/comments/" + sha1, 
          method:"POST", 
          form: {
            "commentBody": commentBody, 
            "signedCommentBody": signedCommentBody
          } 
        }, function(err, res, body) {
          if (err || res.statusCode >= 400) {
            return callback(res.statusCode, false);
          }
          var newComment = {
            commentBody: commentBody,
            address: commonWallet.address
          }
          callback(false, newComment);
        });
      });
    });
  };

  return {
    get: get,
    post: post
  }

};