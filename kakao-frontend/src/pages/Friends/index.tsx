import {
  Avatar,
  Container,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";
import { Box } from "@mui/system";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ImageIcon from "@mui/icons-material/Image";

import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import FriendAdd from "./components/FriendAdd";
import axios from "axios";

type FriendType = {
  id: number;
  name: string;
  statusMessage: string;
};
type ChatType = {
  chatId: number;
};
type FriendTabType = {
  changeTab: (chatId: number) => void;
};
const Friends = (props: FriendTabType): JSX.Element => {
  const { changeTab } = props;
  const [OriginalFriends, setOriginalFriends] = useState<FriendType[]>([]);
  const [friendList, setFriendList] = useState<FriendType[]>([]);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [friend, setFriend] = useState<number | null>(null);
  const changeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    const inputText = event.currentTarget.value;
    if (inputText.length === 0) {
      setFriendList(OriginalFriends);
    } else {
      const filteredFriends = OriginalFriends.filter((friend) =>
        friend.name.includes(inputText)
      );
      setFriendList(filteredFriends);
    }
  };
  const OpenModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  const getFriendList = async () => {
    const { data } = await axios.get<FriendType[]>(
      "http://localhost:5000/friends/1"
    );
    setOriginalFriends(data);
    setFriendList(data);
  };

  const finishAddFriend = async () => {
    await getFriendList();
    closeModal();
  };
  const openMenu = (event: MouseEvent<HTMLDivElement>, friendId: number) => {
    setAnchor(event.currentTarget);
    setFriend(friendId);
  };
  const closeMenu = () => {
    setAnchor(null);
    setFriend(null);
  };
  const makeChat = async () => {
    const { data } = await axios.post<ChatType>("http://localhost:5000/chats", {
      userId: 1,
      friendId: friend,
    });
    const { chatId } = data;
    changeTab(chatId);
    closeMenu();
  };

  useEffect(() => {
    getFriendList();
  }, []);
  return (
    <Container>
      <Modal open={open} onClose={closeModal}>
        <FriendAdd callback={finishAddFriend} />
      </Modal>
      <Menu
        open={anchor !== null}
        anchorEl={anchor}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={makeChat}>채팅하기</MenuItem>
      </Menu>
      <Grid container>
        <Grid item xs={10.5}>
          <TextField
            label="친구 검색"
            variant="outlined"
            fullWidth
            margin="dense"
            onChange={changeSearchText}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Box sx={{ p: "8px" }}>
            <IconButton color="primary" size="large" onClick={OpenModal}>
              <PersonAddIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <List>
        {friendList.map((friend) => {
          return (
            <ListItemButton
              key={friend.id}
              onClick={(event) => openMenu(event, friend.id)}
            >
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friend.name}
                secondary={friend.statusMessage}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Container>
  );
};

export default Friends;
