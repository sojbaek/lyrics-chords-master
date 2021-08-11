import React from "react";
import PropTypes from "prop-types";
import GChord from "./chords";

// 

const ChordsList = ({ chords }) => {
   return(
      Array.from(chords).map( (chord) => <GChord name={chord}/> )
   ) 
};

ChordsList.propTypes = {
    chords: PropTypes.array.isRequired
};

export default ChordsList;