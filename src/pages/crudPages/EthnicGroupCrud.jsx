import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEthnicGroup,
  addEthnicGroup,
  updateEthnicGroup,
  deleteEthnicGroup,
} from "../../features/ethnicGroupSlice.js";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const EthnicGroupsCrudPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.ethnicGroups);
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchEthnicGroup());
  }, [dispatch]);

  const handleAddGroup = () => {
    if (newGroup.trim()) {
      const formData=new FormData()
      formData.append('Name' ,newGroup)
      dispatch(addEthnicGroup( formData))
        .unwrap()
        .then(() => {
          setNewGroup("");
        })
        .catch((err) => console.error("Failed to add group:", err));
    }
  };

  const handleUpdateGroup = () => {
    if (editingGroup && newGroup.trim()) {
      dispatch(
        updateEthnicGroup({ id: editingGroup.id, group: { name: newGroup } })
      )
        .unwrap()
        .then(() => {
          setEditingGroup(null);
          setNewGroup("");
        })
        .catch((err) => console.error("Failed to update group:", err));
    }
  };

  const handleDeleteGroup = (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      dispatch(deleteEthnicGroup(id))
        .unwrap()
        .catch((err) => console.error("Failed to delete group:", err));
    }
  };

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setNewGroup(group.name);
  };

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Typography variant="h4" mb={3} textAlign="center">
        Manage Ethnic Groups
      </Typography>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Ethnic Group"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={editingGroup ? handleUpdateGroup : handleAddGroup}
              fullWidth
              sx={{ height: "100%" }}
            >
              {editingGroup ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {status === "loading" ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          Error: {error}
        </Typography>
      ) : (
        <List>
          {items.map((group) => (
            <ListItem
              key={group.id}
              secondaryAction={
                <>
                  <IconButton onClick={() => handleEditClick(group)} aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteGroup(group.id)}
                    aria-label="delete"
                  >
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={group.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default EthnicGroupsCrudPage;
