import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Rating, CircularProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useTheme } from '@mui/material/styles';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useAppContext } from '../context/AppContext';

// Validation regex patterns
const NAME_REGEX = /^[A-Za-z\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REVIEW_CATEGORIES = [
  'Product Quality', 'Service', 'Delivery', 'Pricing', 'Customer Support', 'Overall Experience'
];
const REVIEW_STATUS = ['New', 'In Progress', 'Responded', 'Resolved', 'Escalated'];
const FEEDBACK_TYPES = ['Complaint', 'Suggestion', 'Compliment', 'Quality Issue', 'Service Request'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];
const FEEDBACK_STATUS = ['Open', 'In Review', 'Resolved', 'Closed'];
const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];

const Review = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // Context: Backend-connected reviews state and CRUD
  const {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    loadReviewsFromDatabase,
    reviewsLoading,
    reviewsError,
    // ADD THESE LINES:
    farmerFeedback,
    farmerFeedbackLoading,
    farmerFeedbackError,
    loadFarmerFeedbackFromDatabase,
    addFarmerFeedback,
    updateFarmerFeedback,
    deleteFarmerFeedback
} = useAppContext();

const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
  open: false,
  type: null, // 'review' or 'feedback'
  itemId: null,
  itemName: '',
  onConfirm: null
});

  // Review form state (local, for form only)
  const [reviewForm, setReviewForm] = useState({
    id: '', customerName: '', customerEmail: '', category: '', rating: 0,
    subject: '', comment: '', date: '', status: 'New'
  });
  const [editReviewIdx, setEditReviewIdx] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({
    id: '', customerName: '', customerEmail: '', category: '', rating: 0,
    subject: '', comment: '', date: '', status: 'New'
  });

  // Feedback state (local, not backend-connected)
  const [feedbackForm, setFeedbackForm] = useState({
    id: '', farmerName: '', farmerId: '', feedbackType: '', rating: 0,
    message: '', date: '', priority: 'Medium', status: 'Open'
  });
  const [feedback, setFeedback] = useState([
    { id: 'FB001', farmerName: 'Ravi Patel', farmerId: 'FARM001', feedbackType: 'Suggestion', rating: 4, message: 'Please consider increasing the milk collection frequency during peak season.', date: '2025-06-08', priority: 'Medium', status: 'In Review' },
    { id: 'FB002', farmerName: 'Lakshmi Devi', farmerId: 'FARM002', feedbackType: 'Complaint', rating: 2, message: 'Payment processing is taking longer than usual this month.', date: '2025-06-07', priority: 'High', status: 'Open' }
  ]);

  // Response dialog state
  const [responseDialog, setResponseDialog] = useState({
    open: false, reviewId: '', response: ''
  });

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Load reviews from backend on mount
  useEffect(() => {
    loadReviewsFromDatabase();
    loadFarmerFeedbackFromDatabase();
  }, []);

  // Tab styling function (unchanged)
  const getTabStyle = (index, isSelected) => {
    const styles = [
      {
        borderRadius: '25px',
        backgroundColor: isSelected ? '#2196f3' : 'transparent',
        color: isSelected ? '#fff' : '#2196f3',
        border: '2px solid #2196f3',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '140px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#1976d2' : '#e3f2fd' }
      },
      {
        borderRadius: '8px 8px 0 0',
        backgroundColor: isSelected ? '#4caf50' : '#f5f5f5',
        color: isSelected ? '#fff' : '#4caf50',
        border: '1px solid #4caf50',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        minWidth: '130px',
        margin: '0 2px',
        '&:hover': { backgroundColor: isSelected ? '#388e3c' : '#e8f5e9' }
      }
    ];
    return styles[index] || {};
  };

  // Review handlers with validation
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerName') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'customerEmail') {
      if (!EMAIL_REGEX.test(value)) setEmailError('Invalid email format');
      else setEmailError('');
    }
    setReviewForm({ ...reviewForm, [name]: value });
  };
  const handleRatingChange = (newValue) => {
    setReviewForm({ ...reviewForm, rating: newValue || 0 });
  };
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (
      reviewForm.customerName && reviewForm.customerEmail && reviewForm.category &&
      reviewForm.subject && reviewForm.comment && !nameError && !emailError
    ) {
      const newReview = {
        ...reviewForm,
        id: `REV${String(reviews.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0]
      };
      try {
        await addReview(newReview);
        setReviewForm({
          id: '', customerName: '', customerEmail: '', category: '', rating: 0,
          subject: '', comment: '', date: '', status: 'New'
        });
      }  catch (error) {
  const errMsg =
    error?.response?.data?.message ||
    error?.message ||
    JSON.stringify(error);
  alert("ERROR\n" + errMsg);
}


    }
  };
  const handleDeleteReview = async (idx) => {
  const reviewToDelete = reviews[idx];
  handleDeleteConfirm(
    'review',
    reviewToDelete.id,
    `review from ${reviewToDelete.customerName}`,
    () => deleteReview(idx)
  );
};

  const handleEditReview = (idx) => {
    setEditReviewIdx(idx);
    setEditReviewForm(reviews[idx]);
    setNameError(''); setEmailError('');
  };
  const handleEditReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerName') {
      if (!NAME_REGEX.test(value)) setNameError('Only alphabets and spaces allowed');
      else setNameError('');
    }
    if (name === 'customerEmail') {
      if (!EMAIL_REGEX.test(value)) setEmailError('Invalid email format');
      else setEmailError('');
    }
    setEditReviewForm({ ...editReviewForm, [name]: value });
  };
  const handleSaveEditReview = async () => {
    if (editReviewIdx !== null && !nameError && !emailError) {
      await updateReview(editReviewIdx, editReviewForm);
      setEditReviewIdx(null);
    }
  };

  // Response handlers
  const handleOpenResponse = (reviewId) => {
    setResponseDialog({ open: true, reviewId, response: '' });
  };
  const handleSaveResponse = async () => {
    const idx = reviews.findIndex(r => r.id === responseDialog.reviewId);
    if (idx !== -1) {
      const updated = {
        ...reviews[idx],
        response: responseDialog.response,
        responseDate: new Date().toISOString().split('T')[0],
        status: 'Responded'
      };
      await updateReview(idx, updated);
    }
    setResponseDialog({ open: false, reviewId: '', response: '' });
  };

  // Feedback handlers (local only)
  const handleFeedbackChange = (e) => {
    setFeedbackForm({ ...feedbackForm, [e.target.name]: e.target.value });
  };
  const handleFeedbackRatingChange = (newValue) => {
    setFeedbackForm({ ...feedbackForm, rating: newValue || 0 });
  };
  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (
        feedbackForm.farmerName && feedbackForm.farmerId && 
        feedbackForm.feedbackType && feedbackForm.message
    ) {
        const newFeedback = {
            ...feedbackForm,
            id: `FB${String(farmerFeedback.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0]
        };
        try {
            await addFarmerFeedback(newFeedback);
            setFeedbackForm({
                id: '', farmerName: '', farmerId: '', feedbackType: '', rating: 0,
                message: '', date: '', priority: 'Medium', status: 'Open'
            });
        } catch (error) {
            alert('Error adding farmer feedback: ' + error.message);
        }
    }
};

const handleDeleteFeedback = async (idx) => {
  const feedbackToDelete = farmerFeedback[idx];
  handleDeleteConfirm(
    'feedback',
    feedbackToDelete.id,
    `feedback from ${feedbackToDelete.farmerName}`,
    () => deleteFarmerFeedback(feedbackToDelete.id)
  );
};

// Delete confirmation handlers
const handleDeleteConfirm = (type, itemId, itemName, onConfirm) => {
  setDeleteConfirmDialog({
    open: true,
    type,
    itemId,
    itemName,
    onConfirm
  });
};

const handleDeleteCancel = () => {
  setDeleteConfirmDialog({
    open: false,
    type: null,
    itemId: null,
    itemName: '',
    onConfirm: null
  });
};

const handleDeleteConfirmExecute = async () => {
  if (deleteConfirmDialog.onConfirm) {
    try {
      await deleteConfirmDialog.onConfirm();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
  handleDeleteCancel();
};



  // Calculate statistics
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'New' || r.status === 'In Progress').length;
  const resolvedReviews = reviews.filter(r => r.status === 'Responded' || r.status === 'Resolved').length;

  // Chart data
  const ratingData = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star`,
    count: reviews.filter(r => r.rating === rating).length
  }));
  const categoryData = REVIEW_CATEGORIES.map(cat => ({
    category: cat.replace(' ', '\n'),
    count: reviews.filter(r => r.category === cat).length,
    fullName: cat
  })).filter(item => item.count > 0);

  const tabLabels = [
    { label: 'Customer Reviews', icon: <FeedbackIcon /> },
    { label: 'Farmer Feedback', icon: <ThumbUpIcon /> }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Enhanced Header */}
      <Box sx={{
        borderRadius: 0,
        p: 4,
        mb: 3,
        background: `linear-gradient(135deg, ${
          ['#2196f3', '#4caf50'][tab]
        } 0%, ${
          ['#21cbf3', '#8bc34a'][tab]
        } 100%)`,
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 80, height: 80 }}>
            {tabLabels[tab].icon}
          </Avatar>
          <Box>
            <Typography variant="h2" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>
              {tabLabels[tab].label}
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Monitor feedback and enhance customer satisfaction
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Container with proper padding and margins */}
      <Box sx={{ px: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <StarIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{avgRating.toFixed(1)}</Typography>
                  <Typography variant="body1">Average Rating</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Out of 5 stars
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <FeedbackIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{totalReviews}</Typography>
                  <Typography variant="body1">Total Reviews</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All time
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{pendingReviews}</Typography>
                  <Typography variant="body1">Pending</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Need response
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingDownIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{resolvedReviews}</Typography>
                  <Typography variant="body1">Resolved</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Completed
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, height: 320 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Rating Distribution</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={ratingData}>
                  <XAxis dataKey="rating" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2196f3">
                    {ratingData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, height: 320 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Review Categories</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Custom Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {tabLabels.map((tabObj, idx) => (
            <Button
              key={tabObj.label}
              onClick={() => setTab(idx)}
              sx={getTabStyle(idx, tab === idx)}
              startIcon={tabObj.icon}
            >
              {tabObj.label}
            </Button>
          ))}
        </Box>

        {/* Customer Reviews Tab */}
        {tab === 0 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>📝</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Customer Review</Typography>
              </Stack>
              <form onSubmit={handleAddReview}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Full Name" name="customerName" value={reviewForm.customerName}
                      onChange={handleReviewChange} required
                      error={!!nameError}
                      helperText={nameError || "Only alphabets and spaces allowed"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Email Address" name="customerEmail" value={reviewForm.customerEmail}
                      onChange={handleReviewChange} required
                      error={!!emailError}
                      helperText={emailError || "Valid email address"}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Category" name="category" value={reviewForm.category}
                      onChange={handleReviewChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {REVIEW_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body1" sx={{ minWidth: 90 }}>Rating</Typography>
                      <Rating
                        name="rating"
                        value={reviewForm.rating}
                        onChange={(_, newValue) => handleRatingChange(newValue)}
                        size="large"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Subject" name="subject" value={reviewForm.subject}
                      onChange={handleReviewChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Comment" name="comment" value={reviewForm.comment}
                      onChange={handleReviewChange} required
                      multiline rows={2}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={reviewForm.status}
                      onChange={handleReviewChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {REVIEW_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976d2 30%, #0288d1 90%)',
                        }
                      }}
                      disabled={!!nameError || !!emailError}
                    >
                      Add Review
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#2196f3', mr: 2, width: 32, height: 32 }}>🗂️</Avatar>
              Customer Reviews
            </Typography>
            {reviewsLoading && (
              <Typography sx={{ mb: 2, color: '#2196f3' }}>Loading reviews...</Typography>
            )}
            {reviewsError && (
              <Typography sx={{ mb: 2, color: 'error.main' }}>Error: {reviewsError}</Typography>
            )}
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(33,150,243,0.2)' : '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review, idx) => (
                    <TableRow key={review.id || idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(33,150,243,0.05)' } }}>
                      <TableCell>
                        <Stack>
                          <Typography fontWeight="bold">{review.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{review.customerEmail}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={review.category} color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Rating value={review.rating} readOnly />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">{review.subject}</Typography>
                        <Typography variant="caption" color="text.secondary">{review.comment}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {review.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={review.status}
                          color={
                            review.status === 'Responded' || review.status === 'Resolved'
                              ? 'success'
                              : review.status === 'In Progress'
                                ? 'warning'
                                : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => handleOpenResponse(review.id)} sx={{ borderRadius: 2 }}>
                            <ReplyIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleEditReview(idx)} sx={{ borderRadius: 2 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteReview(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>🗂️</Avatar>
                          <Typography variant="h6" color="text.secondary">No reviews found</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Farmer Feedback Tab (local only, not backend-connected) */}
        {tab === 1 && (
          <>
            <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3, background: isDark ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)' : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>👨‍🌾</Avatar>
                <Typography variant="h5" fontWeight="bold">Add Farmer Feedback</Typography>
              </Stack>
              <form onSubmit={handleAddFeedback}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer Name" name="farmerName" value={feedbackForm.farmerName}
                      onChange={handleFeedbackChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Farmer ID" name="farmerId" value={feedbackForm.farmerId}
                      onChange={handleFeedbackChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Feedback Type" name="feedbackType" value={feedbackForm.feedbackType}
                      onChange={handleFeedbackChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {FEEDBACK_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Priority" name="priority" value={feedbackForm.priority}
                      onChange={handleFeedbackChange} required select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PRIORITY_LEVELS.map(priority => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth label="Status" name="status" value={feedbackForm.status}
                      onChange={handleFeedbackChange} select
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {FEEDBACK_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body1" sx={{ minWidth: 90 }}>Satisfaction Rating</Typography>
                      <Rating
                        name="rating"
                        value={feedbackForm.rating}
                        onChange={(_, newValue) => handleFeedbackRatingChange(newValue)}
                        size="large"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Message" name="message" value={feedbackForm.message}
                      onChange={handleFeedbackChange} required
                      multiline rows={2}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #388e3c 30%, #43a047 90%)',
                        }
                      }}
                    >
                      Add Feedback
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', mr: 2, width: 32, height: 32 }}>👨‍🌾</Avatar>
              Farmer Feedback
            </Typography>
             {farmerFeedbackLoading && (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <CircularProgress size={36} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading farmer feedback...
                    </Typography>
                  </Box>
                )}

                {/* ERROR STATE */}
                {farmerFeedbackError && (
                  <Box sx={{ p: 4 }}>
                    <Alert severity="error">
                      {farmerFeedbackError}
                    </Alert>
                  </Box>
                )}

                {/* TABLE - Only show when not loading and no error */}
                {!farmerFeedbackLoading && !farmerFeedbackError && (
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Farmer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {farmerFeedback.map((fb, idx) => (
                    <TableRow key={fb.id || idx} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.05)' } }}>
                      <TableCell>
                        <Stack>
                          <Typography fontWeight="bold">{fb.farmerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{fb.farmerId}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={fb.feedbackType} color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Rating value={fb.rating} readOnly />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">{fb.message}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={fb.priority} color={
                          fb.priority === 'High' ? 'error' : fb.priority === 'Medium' ? 'warning' : 'success'
                        } size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={fb.status} color={
                          fb.status === 'Open' ? 'info' : fb.status === 'In Review' ? 'warning' : 'success'
                        } size="small" />
                      </TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteFeedback(idx)} sx={{ borderRadius: 2 }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {farmerFeedback.length === 0 && !farmerFeedbackLoading && !farmerFeedbackError && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'text.secondary', width: 64, height: 64 }}>👨‍🌾</Avatar>
                          <Typography variant="h6" color="text.secondary">No feedback found</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          </>
        )}

        {/* Response Dialog */}
        <Dialog open={responseDialog.open} onClose={() => setResponseDialog({ open: false, reviewId: '', response: '' })} maxWidth="md" fullWidth>
          <DialogTitle>💬Respond to Review</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Response"
              multiline
              rows={3}
              value={responseDialog.response}
              onChange={e => setResponseDialog({ ...responseDialog, response: e.target.value })}
              placeholder="Write your response to the customer..."
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResponseDialog({ open: false, reviewId: '', response: '' })} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button onClick={handleSaveResponse} variant="contained" sx={{ borderRadius: 2 }}>Send Response</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Review Dialog */}
        <Dialog open={editReviewIdx !== null} onClose={() => setEditReviewIdx(null)} maxWidth="md" fullWidth>
          <DialogTitle>✏️Edit Review</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="customerName"
                  value={editReviewForm.customerName}
                  onChange={handleEditReviewChange}
                  required
                  error={!!nameError}
                  helperText={nameError || "Only alphabets and spaces allowed"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="customerEmail"
                  value={editReviewForm.customerEmail}
                  onChange={handleEditReviewChange}
                  required
                  error={!!emailError}
                  helperText={emailError || "Valid email address"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={editReviewForm.category}
                  onChange={handleEditReviewChange}
                  required
                  select
                >
                  {REVIEW_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body1" sx={{ minWidth: 90 }}>Rating</Typography>
                  <Rating
                    name="rating"
                    value={editReviewForm.rating}
                    onChange={(_, newValue) =>
                      setEditReviewForm({ ...editReviewForm, rating: newValue || 0 })
                    }
                    size="large"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={editReviewForm.subject}
                  onChange={handleEditReviewChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comment"
                  name="comment"
                  value={editReviewForm.comment}
                  onChange={handleEditReviewChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  value={editReviewForm.status}
                  onChange={handleEditReviewChange}
                  required
                  select
                >
                  {REVIEW_STATUS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditReviewIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button
              onClick={handleSaveEditReview}
              variant="contained"
              sx={{ borderRadius: 2 }}
              disabled={!!nameError || !!emailError}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        {/* Delete Confirmation Dialog */}
<Dialog
  open={deleteConfirmDialog.open}
  onClose={handleDeleteCancel}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: 'error.light',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'error.main'
      }}
    >
      <DeleteIcon />
    </Box>
    Confirm Deletion
  </DialogTitle>
  <DialogContent>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Are you sure you want to delete this {deleteConfirmDialog.itemName}?
    </Typography>
    <Box
      sx={{
        p: 2,
        backgroundColor: 'error.lighter',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'error.light'
      }}
    >
      <Typography variant="body2" color="error.main">
        <strong>Warning:</strong> This action cannot be undone. The {deleteConfirmDialog.type} will be permanently removed from the system.
      </Typography>
    </Box>
  </DialogContent>
  <DialogActions sx={{ p: 3, pt: 1 }}>
    <Button
      onClick={handleDeleteCancel}
      variant="outlined"
      sx={{ borderRadius: 2, minWidth: 100 }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleDeleteConfirmExecute}
      variant="contained"
      color="error"
      sx={{ borderRadius: 2, minWidth: 100 }}
      startIcon={<DeleteIcon />}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>
      </Box>
    </Box>
  );
};

export default Review;
