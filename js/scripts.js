const wiki_section = document.querySelector('#wiki-getter')
const wiki_output = document.querySelector('#wiki-output')

var url = 'https://en.wikipedia.org/w/api.php?action=parse&origin=*&page=Pet_door&prop=text&section=0&format=json'
var wiki_request = new XMLHttpRequest();

var article
article = document.createElement('div')

function get_article_html(request) {
    let wiki_json
    wiki_json = JSON.parse(request.response)
    return(wiki_json.parse.text["*"])
}

function remove_thumbs(div) {
    let new_div
    let imgs = div.querySelectorAll('div.thumb')
    for (let i = 0; i < imgs.length; i++) {
        let image = imgs[i]
        let parent = image.parentNode
        parent.removeChild(image)
    }
    new_div = div
    return new_div
}

wiki_request.onreadystatechange = () => {
    if (wiki_request.readyState < 4) {
   
        console.log("xhr readyState: " + wiki_request.readyState)
        wiki_output.innerHTML = '<p>Request sent.</p><p> Waiting for response from Wikipedia server.</p>'
   
    } else if (wiki_request.readyState === 4) {

        console.log("xhr readyState: " + wiki_request.readyState)
   
        if (wiki_request.status == 200) {
   
            console.log("xhr status: " + wiki_request.status)

            wiki_output.innerHTML = ''
            article.innerHTML = get_article_html(wiki_request)
            article = remove_thumbs(article)
            wiki_output.appendChild(article)

        } else { 

            console.log("xhr status: " + wiki_request.status)
            
            wiki_section.innerHTML = '<p>There was a problem with the data from Wikipedia</p>'
       
        } // end (status === 200)
    } // end (readyState === 4)
} // end .onreadystatechange listener 

wiki_request.open('GET', url)
wiki_request.send()
