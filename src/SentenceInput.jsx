import React, { Component } from 'react';

export class SentenceInput extends Component {

    url = "https://words.bighugelabs.com/api/2/8caf40de2dbfa99fef564902c9e84f10/"



    state = {
        sentence: "",
        suggestionArray : []
    }

    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        //Split the sentence into an array of words
        let wordArray = this.state.sentence.split(" ");
        //For each word, return a URL into an array
        let urlArray = wordArray.map(word => {
            return this.url + word + "/json"
        })
        // console.log("URLArray : ", urlArray)
        Promise.all(urlArray.map(single_url =>
            fetch(single_url)
                // .then(r => r.text())
                .then(r => r.json())
        )).then(texts => {
            //get the part of speech key of the word at the index in the word array
            // let key = Object.keys(texts[0])
            let newWordArray = ["Did", "you", "mean", "to", "say"];
            for (let i = 0; i < texts.length; i++) {
                // console.log("Object Key : ", Object.keys(texts[i]))
                let key = Object.keys(texts[0])
                key = key[0]
                // console.log(texts[i])
                newWordArray.push(texts[i][key].syn[0])
                // console.log(texts[i][key].syn[0])
            }
            console.log("New Word Array ",newWordArray)
            this.setState({
                suggestionArray : newWordArray
            })

        }).catch(e => console.log(e))
        //check the words to make sure theyre valid



        // let fetchURL = this.url + this.state.sentence + "/json";
        // await fetch(fetchURL).then(r => r.json()).then(r => console.log(r))
    };



    render() {
        // console.log(this.state)
        let suggestionString = this.state.suggestionArray.join(" ");


        return (
            <div>

                <form className="sentenceInputForm" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="sentenceInput">What Did You Say?</label>
                        <div>
                            <input
                                type="text"
                                required
                                className="form-control"
                                onChange={this.handleFieldChange}
                                id="sentence"
                                placeholder="Enter phrase here"
                            />
                        </div>
                    </div>
                    <button type="submit">
                        Enter
                </button>
                </form>
                <p>{suggestionString}</p>
            </div>
        );
    }
}

export default SentenceInput;
