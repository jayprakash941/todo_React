import React from "react";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";

// Material Icon
import CloseIcon from "@material-ui/icons/Close";

// JSS
const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    margin: 'auto',
    height: '100%'
  }
}));

// Full page popup
const FullPageModal = ({ title, open, handleClose, children }) => {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={handleClose}>
      <div className={classes.paper}>
        <Grid container direction="column">
          <Grid item xs={12}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography component="h1" variant="h5">
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={_ => handleClose()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default FullPageModal;
