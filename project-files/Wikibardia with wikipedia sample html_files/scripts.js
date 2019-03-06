const wiki_section = document.querySelector('#wiki-getter')
const wiki_output = document.querySelector('#wiki-output')

var url = 'https://en.wikipedia.org/w/api.php?action=parse&origin=*&page=Pet_door&prop=text&section=0&format=json'
var wiki_request = new XMLHttpRequest();

function remove_thumbs(section_id) {
    let selector = section_id + " div.thumb"
    let imgs = document.querySelectorAll(selector)
    for (let i = 0; i < imgs.length; i++) {
        let image = imgs[i]
        let parent = image.parentNode
        parent.removeChild(image)
    }
}

wiki_request.onreadystatechange = () => {
    if (wiki_request.readyState < 4) {
   
        console.log("xhr readyState: " + wiki_request.readyState)
        wiki_output.innerHTML = '<p>Request sent.</p><p> Waiting for response from Wikipedia server.</p>'
   
    } else if (wiki_request.readyState === 4) {

        console.log("xhr readyState: " + wiki_request.readyState)
   
        if (wiki_request.status == 200) {
   
            console.log("xhr status: " + wiki_request.status)

            let wiki_json
            let article_html

            wiki_json = JSON.parse(wiki_request.response)
            article_html = wiki_json.parse.text["*"]   
            wiki_output.innerHTML = article_html

            remove_thumbs('#wiki_output')

        } else { 

            console.log("xhr status: " + wiki_request.status)        
            wiki_section.innerHTML = '<p>There was a problem with the data from Wikipedia</p>'
       
        } // end (status === 200)
    } // end (readyState === 4)
} // end .onreadystatechange listener 

wiki_request.open('GET', url)
wiki_request.send()

