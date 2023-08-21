import React, { Component } from 'react';

import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';

import { withStyles } from '@material-ui/core/styles';

import $ from 'jquery';
import FileSaver from "file-saver";

import params from './config.js'

const useStyles = theme => ({
  root: {
    textAlign: "center",
    backgroundColor: "black",
    color: "white"
  },

  rootLight: {
    textAlign: "center",
    backgroundColor: "white",
    background: "white",
    bgcolor: "white",
    color: "black"
  },

  inputLabel: {
    color : 'white !important'
  },

  outlinedInput: {
    color: 'white !important',
    '&$inputFocused $notchedOutline': {
      borderColor: 'white',
      color: 'white !important'
    }
  },

  inputFocused: {color : 'white !important'},

  notchedOutline: {
    borderWidth: '2px',
    borderColor: 'white !important',
    color: 'white !important'
  },

  inputLabelLight: {
    color : 'black !important'
  },

  outlinedInputLight: {
    color: 'black !important',
    '&$inputFocused $notchedOutline': {
      borderColor: 'black',
      color: 'black !important'
    }
  },

  inputFocusedLight: {color : 'black !important'},

  notchedOutlineLight: {
    borderWidth: '2px',
    borderColor: 'black !important',
    color: 'black !important'
  },

  redacted: {
    backgroundColor: "white",
    color: "white"
  },

  redactedLight: {
    backgroundColor: "black",
    color: "black"
  }
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storyDiversity: 0.5,
      maxLen: null,
      maxLenErr: null,
      topic: null,
      story: null,
      dark: true,
      size: 16,
      font: 0,
      fontMenuOpen: false,
      anchorEl: null,
      raw: params.raw
    }

  }

  clean = (text) => {
    const substitutionDic = {
      "&lt;unk&gt;": "<unk>",
      " &#x27;ve": "'ve",
      " ' ve": "'ve ",
      " &#x27;m ": "'m ",
      " ' m ": "'m ",
      " &#x27;re": "'re ",
      " ' re ": "'re ",
      " n&#x27;t": "n't",
      " &#x27;s ": "'s ",
      " ' s ": "'s ",
      " ’ s ": "’s ",
      "&#x27;": "'",
      " ,": ",",
      " .": ".",
      " ?": "?",
      " !": "!"
    }
    for (const [pattern, replacement] of Object.entries(substitutionDic)){
      text = text.replaceAll(pattern, replacement)
    }
    return text
  }

  getStory = () => {
    this.setState({loading: true})
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:5000/api/story",
      data: {
        topic: this.state.topic,
        story_temp: this.state.storyDiversity,
        max_len: this.state.maxLen
      }
    }).done((output) => {
      console.log(output);
      this.setState({
        story: {
          raw: output.split('<br>')
        },
        loading: false
      });
    })
  };

  render() {
    var {
      maxLen, maxLenErr, story, dark, font, size, fontMenuOpen, anchorEl, raw,
      loading
    } = this.state;
    const {
      topic_placeholder, topic_label, generate_button_text, size_label,
      dark_button_text, light_button_text, font_button_text, story_temp_label,
      max_len_label, story_placeholder, fonts, save_button_text, font_size,
      clean_button_text, raw_button_text, raw_button, loading_text
    } = params;
    const { classes } = this.props;
    return (
      <div className={dark?classes.root:classes.rootLight}>
        <br/>
        <br/>
        <Grid container spacing={0}>
          <Grid item xs={2} />
          <Grid item xs={4}>
            <FormControl
              sx={{ m: 1, width: '100%', textAlign: 'left' }}
              variant="outlined"
              style={{color: "white"}}
            >
              <CustomTextField
                classes={classes} dark={dark}
                font={fonts[font]}
                id='prompt'
                font_size={font_size}
                label={topic_label}
                placeholder={topic_placeholder}
                multiline={true}
                onChange={(event) => {
                  const { value } = event.target;
                  this.setState({topic: value});
                }}
              /><br/>
              <LoadingButton
                loading={loading}
                variant="contained"
                loadingIndicator={
                  <CircularProgress color="inherit" size={16} />
                }
                loadingPosition="start"
                startIcon={<span/>}
                disabled={!maxLen}
                onClick={this.getStory}
                style={{
                  backgroundColor: !dark?'black':'white',
                  color: !dark?'white':'black',
                  fontFamily: fonts[font]
                }}
              >
                {!loading?generate_button_text:loading_text}
              </LoadingButton>
            </FormControl>
          </Grid>
          <Grid item xs={2} sx={{ align: 'center' }}>
            <FormControl sx={{ m: 1, width: '80%', align: 'center' }} variant="outlined">
              <Stack direction="column" spacing={2}>
                <Typography
                  gutterBottom
                  style={{
                    textAlign: 'right',
                    fontFamily: fonts[font]
                  }}
                >
                  {size_label}
                </Typography>
                <Slider
                  aria-label="Always visible"
                  defaultValue={16}
                  step={1}
                  min={12}
                  max={156}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value)=>(
                    <span style={{fontFamily: fonts[font]}}>{value}</span>
                  )}
                  style={{
                    backgroundColor: dark?'black':'white',
                    color: dark?'white':'black'
                  }}
                  onChange={(event, newValue) => {
                    this.setState({
                      size: newValue
                    });
                  }}
                />
                <Button
                  variant="contained"
                  onClick={()=>{this.setState({dark: !dark})}}
                  style={{
                    backgroundColor: !dark?'black':'white',
                    color: !dark?'white':'black',
                    fontFamily: fonts[font]
                  }}
                >
                  {dark?dark_button_text:light_button_text}
                </Button>
                <Button
                  variant="contained"
                  id="fontbutton"
                  aria-controls="fontmenu"
                  aria-haspopup="true"
                  aria-expanded={fontMenuOpen ? 'true' : undefined}
                  onClick={(event)=>{
                    this.setState({
                      fontMenuOpen: !fontMenuOpen,
                      anchorEl: event.currentTarget
                    })
                  }}
                  style={{
                    backgroundColor: dark?'black':'white',
                    color: dark?'white':'black',
                    fontFamily: fonts[font]
                  }}
                >{font_button_text}</Button>
                <Menu
                  anchorEl={anchorEl}
                  id="fontmenu"
                  open={fontMenuOpen}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {
                    fonts.map((f, i)=>(
                      <MenuItem
                        key={f}
                        onClick={()=>{
                          this.setState({
                            font: i,
                            fontMenuOpen: !fontMenuOpen,
                            anchorEl: null
                          })
                        }}
                      >
                        <Typography style={{fontFamily: f}}>
                          {f}
                        </Typography>
                      </MenuItem>
                    ))
                  }
                </Menu>
              </Stack>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
              <FormControl sx={{ m: 1, width: '90%' }} variant="outlined">
                <Stack direction="column" spacing={2}>
                  <Typography
                    gutterBottom
                    style={{
                      textAlign: 'right',
                      fontFamily: fonts[font]
                    }}
                  >
                    {story_temp_label}
                  </Typography>
                  <Slider
                    aria-label="Always visible"
                    defaultValue={0.5}
                    valueLabelFormat={(value)=>(
                      <span style={{fontFamily: fonts[font]}}>{value}</span>
                    )}
                    step={0.01}
                    min={0.03}
                    max={4.5}
                    valueLabelDisplay="on"
                    style={{
                      backgroundColor: dark?'black':'white',
                      color: dark?'white':'black'
                    }}
                    onChange={(event, newValue) => {
                      this.setState({
                        storyDiversity: newValue
                      });
                    }}
                  />
                  <CustomTextField
                    id="ml"
                    label={max_len_label}
                    dark={dark}
                    error={!!maxLenErr}
                    helperText={maxLenErr}
                    font={fonts[font]}
                    classes={classes}
                    variant="outlined"
                    onChange={(event) => {
                      const { value } = event.target;
                      var numVal = null;
                      if (isNaN(value)) {
                        this.setState({
                          maxLen: null,
                          maxLenErr: "Must be a numerical value"
                        });
                      }
                      else {
                        numVal = +value;
                        if (numVal<1) {
                          this.setState({
                            maxLen: null,
                            maxLenErr: "Must be greater than one"
                          });
                        }
                        else {
                          this.setState({
                            maxLen: numVal,
                            maxLenErr: null
                          });
                        }
                      }
                    }}
                  />
                  {
                    story
                    ? <Grid container spacing={0} columns={raw_button?15:12}>
                        {
                          raw_button
                          ? <Grid item xs={7}>
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={()=>{this.setState({raw: !raw})}}
                                style={{
                                  backgroundColor: !dark?'black':'white',
                                  color: !dark?'white':'black',
                                  fontFamily: fonts[font]
                                }}
                              >
                                {raw?clean_button_text:raw_button_text}
                              </Button>
                            </Grid>
                          : null
                        }
                        {
                          raw_button
                          ? <Grid xs={1} item />
                          : null
                        }
                        <Grid item xs={raw_button?7:12}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={()=>{
                              FileSaver.saveAs(
                                new Blob(
                                  [JSON.stringify(story, null, 2)],
                                  {type: "text/plain;charset=utf-8"}
                                ),
                                `story_${Math.floor(Math.random()*1000000000)+1}.txt`
                              )
                            }}
                            style={{
                              backgroundColor: !dark?'black':'white',
                              color: !dark?'white':'black',
                              fontFamily: fonts[font]
                            }}
                          >
                            {save_button_text}
                          </Button>
                        </Grid>
                      </Grid>
                    : null
                  }
                </Stack>
              </FormControl>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={12} >
            <br/>
            <br/>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={8} >
            <div
              id="story"
              style={{
                fontSize: size,
                fontFamily: fonts[font],
                textAlign: 'justify'
              }}
            >
              {story?(
                (
                  raw
                  ? story.raw
                  : story.cooked).map((line, i)=>(
                      <div key={`line_${i}`}>{line}</div>
                    ))
              ):story_placeholder}
            </div>
          </Grid>
          <Grid item xs={2} />
        </Grid>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    );
  }
}

class CustomTextField extends Component {
  render () {
    const {
      id, label, placeholder, onChange, classes, dark, multiline=false, error,
      helperText, font, font_size
    } = this.props;
    return <TextField
      id={id}
      label={
        <span style={{fontFamily: font}}>
          {label}
        </span>
      }
      multiline={multiline}
      variant="outlined"
      rows={5}
      placeholder={placeholder}
      onChange={onChange}
      error={error}
      helperText={helperText}
      InputLabelProps={{
        classes: {
          root: dark?classes.inputLabel:classes.inputLabelLight,
          focused: dark?classes.inputFocused:classes.inputFocusedLight
        }
      }}
      InputProps={{
        style: {fontFamily: font, fontSize: font_size},
        classes: {
          root: dark?classes.outlinedInput:classes.outlinedInputLight,
          focused: dark?classes.inputFocused:classes.inputFocusedLight,
          notchedOutline: dark?classes.notchedOutline:classes.notchedOutlineLight
        }
      }}
    />;
  }
}

export default withStyles(useStyles)(App);
