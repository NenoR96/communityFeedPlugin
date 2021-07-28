const checkPost = (post) =>{
    if(post?.userId && post?.username && post?.postText) return true;
    else return false
}
const FeedAPI = {

    loadPosts : (callback) =>{
        buildfire.appData.get("CommunityFeedPost", (err, result) => {
            if (err){
                if(callback) return callback(err , null)
            }
            else{
                let data = result.data;
                data.sort((a,b) => new Date(b.DateTime) - new Date(a.DateTime));
                result.data = data;
                if(callback) return callback(null , result)
            }
            })
    },
    addPost : (post , callback) =>{
        if(!checkPost(post)){
            if(callback) callback("An error occured (Malformatted post)" , null)
        }
        else{
            FeedAPI.loadPosts((err , resp) =>{
                if(err){
                    if(callback) return callback("Error while inserting your data" , null); 
                }
                else{
                    let data = resp.data;
                    let newPost = {...post, postId : data.length + 1, userImg : "", DateTime : new Date().toLocaleString(), postImage : [], pluginName : "Community Wall", pluginNav : null} 
                    data.unshift(newPost)
                    buildfire.appData.save(data, "CommunityFeedPost", (err2, result) => {
                        if (err2) return callback("Error while inserting your data" , null);
                        else{
                            if(callback) callback(null , result)
                        }
                    });
                }
            })
            // let tempID = post.postId;
            // for(let i = 0 ; i < posts.length - 1 ; i++){
            //     if(posts[i].postId == tempID) return callback("Post ID already in use" , null); 
            // }
            // buildfire.appData.save(posts, "CommunityFeedPost", (err, result) => {
            //     if (err) return callback("Error while inserting your data" , null);
            //     else{
            //         if(callback) callback(null , result)
            //     }
            // });
        } 
    },
    deletePost : (postId , callback) => {

        buildfire.appData.get("CommunityFeedPost", (err, result) => {
            if (err){
                if(callback) return callback(err , null)
                
            }
            else{
                let index = result.data.findIndex(e => e.postId == postId);
                if(index < 0) return callback(`Couldn't Find post with the ID: ${postId}` , null)
                else{
                    let data = result.data;
                    data.splice(index , 1);
                    buildfire.appData.save(data, "CommunityFeedPost", (err2, result) => {
                        if (err2) return callback("Error while updating your data" , null);
                        else{
                            if(callback) callback(null , result)
                        }
                    });
                }
            }});


    },
    updatePost : (post, callback) =>{
        let postId = post.postId;
        buildfire.appData.get("CommunityFeedPost", (err, result) => {
            if (err){
                if(callback) return callback(err , null)
                
            }
            else{
                let index = result.data.findIndex(e => e.postId == postId);
                if(index < 0) return callback(`Couldn't Find post with the ID: ${postId}` , null)
                else{
                    let data = result.data;
                    data[index].userId = post.userId;
                    data[index].username = post.username;
                    data[index].postText = post.postText;
                    buildfire.appData.save(data, "CommunityFeedPost", (err2, result) => {
                        if (err2) return callback("Error while updating your data" , null);
                        else{
                            if(callback) callback(null , result)
                        }
                    });
                }
        }});
    }
} 

const createModal = () =>{

}
