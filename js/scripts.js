const wiki_section = document.querySelector('#wiki-getter')
const wiki_output = document.querySelector('#wiki-output')
const shakes_output = document.querySelector('#shakes-output')
const search_btn = document.querySelector('#search')
const search_input = document.querySelector('#wiki-search')
const pageid_location = "query.search.0.pageid"
const wiki_text_location = 'parse.text.*'

var wikipedia_url = 'https://en.wikipedia.org/w/api.php?action=parse&origin=*&prop=text&section=0&format=json'
var wikipedia_sr_url = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srlimit=1&srenablerewrites=1&format=json'
var shakes_request_url = 'https://api.funtranslations.com/translate/shakespeare.json?'
var wiki_request = new XMLHttpRequest()
var wiki_sr_request = new XMLHttpRequest()
var shakes_request = new XMLHttpRequest()
var wiki_text
var article

// testing
// end testing


article = document.createElement('div')

/*****************************************************************
Functions
******************************************************************/

function select_item(object, key_array) {

    if (key_array.length === 0) {

        return object
    
    } else {

        let selector = key_array.shift()
        let selection = object[selector]
        return select_item(selection, key_array)

    }
}

function get_item_from_json_request(request, item_location) {

    // item_location should be a dot-notation string specifying
    // the location of the item.  i.e 'search.0.pageid'
    
    let json
    let item 
    
    json = JSON.parse(request.response)
    keys = item_location.split('.')
    
    item = select_item(json, keys)

    return item

}

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

function make_api_url(key, value, base_url, ampersand) {
    let uri = encodeURI(value)
    let url
    if (ampersand) {
        url = base_url + '&' + key + "=" + uri
    } else {
        url = base_url + key + "=" + uri
    }
    return url
}

/*****************************************************************
 AJAX Listeners
******************************************************************/

wiki_sr_request.onreadystatechange = () => {
    if (wiki_sr_request.readyState < 4) {

        console.log("wiki sr xhr readyState: " + wiki_sr_request.readyState)
        let status = document.createElement('p')
        status.innerText = "Searching..."
        wiki_output.appendChild(status)

    } else if (wiki_sr_request.readyState === 4) {

        console.log("wiki sr xhr readyState: " + wiki_sr_request.readyState)

        if (wiki_sr_request.status == 200) {

            console.log("wiki sr xhr status: " + wiki_sr_request.status)

            let pageid
            let wiki_parse_url
            pageid = get_item_from_json_request(wiki_sr_request, pageid_location)
            wiki_parse_url = make_api_url('pageid', pageid, wikipedia_url, true)
            wiki_request.open('GET', wiki_parse_url)
            wiki_request.send()

        } else {

            console.log("wiki sr xhr status: " + wiki_sr_request.status)

        }
    }
}

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

            shakes_request_url = make_api_url('text', wiki_text, shakes_request_url, false)
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
        shakes_output.innerHTML = '<p>Your request did I send.</p><p>Awaiting FunTranslations their response to come hither.</p>'
    
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
            shakes_output.innerHTML = '<p>Mine most humble apology: a problem thither wast with the data from Funtranslations.</p>'

        } // end (status === 200)
    } // end (readyState === 4)
} // end onreadystatechange listener

/*****************************************************************
Form listeners
******************************************************************/

search_btn.addEventListener('click', () => {
    let sr_value = search_input.value 
    search_input.value = ''
    let wiki_sr_url = make_api_url('srsearch', sr_value, wikipedia_sr_url, true)
    wiki_sr_request.open('GET', wiki_sr_url)
    wiki_sr_request.send()
})

