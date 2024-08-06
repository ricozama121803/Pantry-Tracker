'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore, auth } from "@/firebase"; // Assuming you've already set up Firebase auth in your firebase.js
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { 
  collection, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  getDoc, 
  setDoc, 
} from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      const { quantity } = docSnap.data();
      if (quantity === 1){
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      setLoginModalOpen(false);
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      setLoginModalOpen(false);
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setLoginModalOpen(true);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleModalClose = () => {
    if (!user) {
      setLoginModalOpen(true);
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      sx={{
        backgroundImage: `url('/backgroundv2.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      gap={4}
    >
      <Modal open={loginModalOpen} onClose={handleModalClose}>
        <Box
          position="absolute"
          top="50%" 
          left="50%" 
          width={400}
          bgcolor="#333" // Darker modal background
          border="1px solid #444" // Slightly lighter border for contrast
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" color="#fff">Login or Create Account</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#777' }, '&.Mui-focused fieldset': { borderColor: '#888' } } }} // Adjust input field colors
            />
            <TextField
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#777' }, '&.Mui-focused fieldset': { borderColor: '#888' } } }} // Adjust input field colors
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                onClick={handleSignup}
              >
                Sign Up
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      {user && (
        <>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
            onClick={handleOpen}
          >
            Add New Item
          </Button>
          <Box 
            width="800px" 
            border="1px solid #444" 
            borderRadius="12px" // Rounded corners for the main box
            overflow="hidden" 
            boxShadow={2}
            bgcolor="#333" // Solid background color for the inventory box
          >
            <Box
              width="100%"
              height="100px"
              bgcolor="#333" // Dark background for header
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant='h2' color="#fff">
                Inventory Items
              </Typography>
            </Box>
            <Stack width="100%" maxHeight="300px" spacing={2} overflow="auto" p={2}>
              {inventory.map(({ name, quantity }) => (
                <Box 
                  key={name}
                  width="100%" 
                  minHeight="100px" 
                  display="flex"
                  alignItems="center" 
                  justifyContent="space-between" 
                  bgcolor="#444" // Dark background for each item
                  padding={2}
                  borderRadius="12px" // More rounded corners for each item
                  boxShadow={1}
                  sx={{
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: '#555', // Hover effect
                    }
                  }}
                >
                  <Box
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h4" color="#fff" sx={{ flex: 1 }}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h4" color="#fff" sx={{ width: '50px', textAlign: 'center' }}>
                      {quantity}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }, fontSize: '1.5rem' }} // Adjust fontSize as needed
                        onClick={() => addItem(name)}
                      >
                        +
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' }, fontSize: '1.5rem' }} // Adjust fontSize as needed
                        onClick={() => removeItem(name)}
                      >
                        -
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      )}
    </Box>
  );
}
