import React from "react";
import PropTypes from "prop-types";
import GChord from "./gChord";

const ChordsList = ({ chords }) => {
  if (chords != null) {
    // var chordlistlength = this.chordsList.length;
    // if (chordlistlength  == 0) {
    //     for (const x of this.chordsUsed) {
    //         this.chordsList.push(new GChord(x));
    //     }
    // } else {
    //     let array = Array.from(this.chordsUsed);
    //     for (var ii= 0; ii < chordlistlength; ii++) {
    //         var chord = array[ii];
    //         this.chordsList[ii].setChord(chord);
    //     }
    // }    
  } 
};

ChordsList.propTypes = {
    chords: PropTypes.array.isRequired
};

export default ChordsList;