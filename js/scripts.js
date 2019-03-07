const wiki_section = document.querySelector('#wiki-getter')
const wiki_output = document.querySelector('#wiki-output')
const shakes_output = document.querySelector('#shakes-output')

var wikipedia_url = 'https://en.wikipedia.org/w/api.php?action=parse&origin=*&page=Pet_door&prop=text&section=0&format=json'
var wiki_request = new XMLHttpRequest()
var shakes_request = new XMLHttpRequest()
var shakes_request_url = 'https://api.funtranslations.com/translate/shakespeare.json'
var wiki_text
var article

article = document.createElement('div')

// Functions

function get_article_html(request) {
    let wiki_json
    wiki_json = JSON.parse(request.response)
    return(wiki_json.parse.text["*"])
}

function get_shakes_html(request) {
    let p 
    p = document.createElement('p')
    
    let shakes_json
    shakes_json = JSON.parse(request.response)
    p.innerText = shakes_json.contents.translated

    return p
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

function get_wiki_text(paragraph) {
    let p_text = paragraph.innerText
    return p_text
}

function make_shakes_url(text, base_url) {
    let uri = encodeURI(wiki_text)
    let url = base_url + '?text=' + uri
    return url
}

// AJAX Listeners

wiki_request.onreadystatechange = () => {
    if (wiki_request.readyState < 4) {
   
        console.log("wiki xhr readyState: " + wiki_request.readyState)
        wiki_output.innerHTML = '<p>Request sent.</p><p> Waiting for response from Wikipedia server.</p>'
   
    } else if (wiki_request.readyState === 4) {

        console.log("wiki xhr readyState: " + wiki_request.readyState)
   
        if (wiki_request.status == 200) {
   
            console.log("wiki xhr status: " + wiki_request.status)

            // process Wikipedia response and set wiki-output

            wiki_output.innerHTML = ''
            article.innerHTML = get_article_html(wiki_request)
            article = remove_thumbs(article)
            wiki_output.appendChild(article)

            // get wiki text and send to translator

            let p = article.querySelector('.mw-parser-output p')
            wiki_text = get_wiki_text(p)

            shakes_request_url = make_shakes_url(wiki_text, shakes_request_url)
            shakes_request.open('POST', shakes_request_url)
            shakes_request.send()

        } else { 

            console.log("wiki xhr status: " + wiki_request.status)            
            wiki_output.innerHTML = '<p>There was a problem with the data from Wikipedia</p>'
       
        } // end (status === 200)
    } // end (readyState === 4)
} // end .onreadystatechange listener 

shakes_request.onreadystatechange = () => {
    if (shakes_request.readyState < 4) {

        console.log("shakes xhr readyState: " + shakes_request.readyState)
        shakes_output.innerHTML = '<p>Request sent.</p><p> Waiting for response from FunTranslations server.</p>'
    
    } else if (shakes_request.readyState === 4) {

        console.log("shakes xhr readyState: " + shakes_request.readyState)

        if (shakes_request.status == 200) {

            // Process FunTranslations response and post to shakes-output

            console.log("shakes xhr status: " + shakes_request.status)
            shakes_output.innerHTML = ''
            let shakes_p 
            shakes_p = get_shakes_html(shakes_request)            
            shakes_output.appendChild(shakes_p)
            
        } else {

            console.log("shakes xhr status: " + shakes_request.status)
            shakes_output.innerHTML = '<p>There was a problem with the data from FunTranslations.</p>'

        } // end (status === 200)
    } // end (readyState === 4)
} // end onreadystatechange listener

// Program

wiki_request.open('GET', wikipedia_url)
wiki_request.send()
