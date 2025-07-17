import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response received:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error);
    return Promise.reject(error.response?.data || error.message);
  }
);

// Farmers API methods
export const farmersAPI = {
  getAll: () => {
    console.log('🔄 Calling farmersAPI.getAll()');
    return api.get('/farmers');
  },
  create: (data) => {
    console.log('➕ Calling farmersAPI.create() with data:', data);
    return api.post('/farmers', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling farmersAPI.update() with id:', id, 'data:', data);
    return api.put(`/farmers/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling farmersAPI.delete() with id:', id);
    return api.delete(`/farmers/${id}`);
  },
};

// Suppliers API methods
export const suppliersAPI = {
  getAll: () => {
    console.log('🔄 Calling suppliersAPI.getAll()');
    return api.get('/suppliers');
  },
  create: (data) => {
    console.log('➕ Calling suppliersAPI.create() with data:', data);
    return api.post('/suppliers', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling suppliersAPI.update() with id:', id, 'data:', data);
    return api.put(`/suppliers/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling suppliersAPI.delete() with id:', id);
    return api.delete(`/suppliers/${id}`);
  },
  getStats: () => api.get('/suppliers/stats'),
};

// Milk Entries API methods
export const milkEntriesAPI = {
  getAll: () => {
    console.log('🔄 Calling milkEntriesAPI.getAll()');
    return api.get('/milk-entries');
  },
  create: (data) => {
    console.log('➕ Calling milkEntriesAPI.create() with data:', data);
    return api.post('/milk-entries', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling milkEntriesAPI.update() with id:', id, 'data:', data);
    return api.put(`/milk-entries/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling milkEntriesAPI.delete() with id:', id);
    return api.delete(`/milk-entries/${id}`);
  },
  getStats: () => api.get('/milk-entries/stats'),
  getByFarmer: (farmerId) => api.get(`/milk-entries/farmer/${farmerId}`),
  getByDateRange: (startDate, endDate) => api.get(`/milk-entries/date-range?startDate=${startDate}&endDate=${endDate}`)
};

// Fleet Management API methods
export const fleetManagementAPI = {
  getAll: () => {
    console.log('🔄 Calling fleetManagementAPI.getAll()');
    return api.get('/fleet-management');
  },
  create: (data) => {
    console.log('➕ Calling fleetManagementAPI.create() with data:', data);
    return api.post('/fleet-management', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling fleetManagementAPI.update() with id:', id, 'data:', data);
    return api.put(`/fleet-management/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling fleetManagementAPI.delete() with id:', id);
    return api.delete(`/fleet-management/${id}`);
  },
  getStats: () => api.get('/fleet-management/stats'),
  getById: (id) => api.get(`/fleet-management/${id}`)
};

// Deliveries API methods
export const deliveriesAPI = {
  getAll: () => {
    console.log('🔄 Calling deliveriesAPI.getAll()');
    return api.get('/deliveries');
  },
  getById: (id) => {
    console.log('🔍 Calling deliveriesAPI.getById() with id:', id);
    return api.get(`/deliveries/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling deliveriesAPI.create() with data:', data);
    return api.post('/deliveries', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling deliveriesAPI.update() with id:', id, 'data:', data);
    return api.put(`/deliveries/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling deliveriesAPI.delete() with id:', id);
    return api.delete(`/deliveries/${id}`);
  },
};

// Quality Tests API methods
export const qualityTestsAPI = {
  getAll: () => api.get('/quality-tests'),
  create: (data) => api.post('/quality-tests', data),
  update: (id, data) => api.put(`/quality-tests/${id}`, data),
  delete: (id) => api.delete(`/quality-tests/${id}`),
};

// Dashboard API methods
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getChartData: (type) => api.get(`/dashboard/charts/${type}`),
};

// Processing Units API methods
export const processingUnitsAPI = {
  getAll: () => api.get('/processing-units'),
  create: (data) => api.post('/processing-units', data),
  update: (id, data) => api.put(`/processing-units/${id}`, data),
  delete: (id) => api.delete(`/processing-units/${id}`),
};

// ✅ CORRECTED: Production Batches API
export const productionBatchesAPI = {
  getAll: () => {
    console.log('🔄 Calling productionBatchesAPI.getAll()');
    return api.get('/production-batches');
  },
  create: (data) => {
    console.log('➕ Calling productionBatchesAPI.create() with data:', data);
    return api.post('/production-batches', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling productionBatchesAPI.update() with id:', id, 'data:', data);
    return api.put(`/production-batches/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling productionBatchesAPI.delete() with id:', id);
    return api.delete(`/production-batches/${id}`);
  }
};
  // Quality Control Records API methods
export const qualityControlAPI = {
  getAll: () => {
    console.log('🔄 Calling qualityControlAPI.getAll()');
    return api.get('/quality-control-records');
  },
  getById: (id) => {
    console.log('🔍 Calling qualityControlAPI.getById() with id:', id);
    return api.get(`/quality-control-records/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling qualityControlAPI.create() with data:', data);
    return api.post('/quality-control-records', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling qualityControlAPI.update() with id:', id, 'data:', data);
    return api.put(`/quality-control-records/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling qualityControlAPI.delete() with id:', id);
    return api.delete(`/quality-control-records/${id}`);
  },
};
  // Maintenance Records API methods
export const maintenanceAPI = {
  getAll: () => {
    console.log('🔄 Calling maintenanceAPI.getAll()');
    return api.get('/maintenance-records');
  },
  getById: (id) => {
    console.log('🔍 Calling maintenanceAPI.getById() with id:', id);
    return api.get(`/maintenance-records/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling maintenanceAPI.create() with data:', data);
    return api.post('/maintenance-records', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling maintenanceAPI.update() with id:', id, 'data:', data);
    return api.put(`/maintenance-records/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling maintenanceAPI.delete() with id:', id);
    return api.delete(`/maintenance-records/${id}`);
  },
};
 // Retailers API methods
export const retailersAPI = {
  getAll: () => {
    console.log('🔄 Calling retailersAPI.getAll()');
    return api.get('/retailers');
  },
  getById: (id) => {
    console.log('🔍 Calling retailersAPI.getById() with id:', id);
    return api.get(`/retailers/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling retailersAPI.create() with data:', data);
    return api.post('/retailers', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling retailersAPI.update() with id:', id, 'data:', data);
    return api.put(`/retailers/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling retailersAPI.delete() with id:', id);
    return api.delete(`/retailers/${id}`);
  },
};

// Sales API methods
export const salesAPI = {
  getAll: () => {
    console.log('🔄 Calling salesAPI.getAll()');
    return api.get('/sales');
  },
  getById: (id) => {
    console.log('🔍 Calling salesAPI.getById() with id:', id);
    return api.get(`/sales/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling salesAPI.create() with data:', data);
    return api.post('/sales', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling salesAPI.update() with id:', id, 'data:', data);
    return api.put(`/sales/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling salesAPI.delete() with id:', id);
    return api.delete(`/sales/${id}`);
  },
};
// Inventory Records API methods
export const inventoryAPI = {
  getAll: () => {
    console.log('🔄 Calling inventoryAPI.getAll()');
    return api.get('/inventory-records');
  },
  getById: (id) => {
    console.log('🔍 Calling inventoryAPI.getById() with id:', id);
    return api.get(`/inventory-records/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling inventoryAPI.create() with data:', data);
    return api.post('/inventory-records', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling inventoryAPI.update() with id:', id, 'data:', data);
    return api.put(`/inventory-records/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling inventoryAPI.delete() with id:', id);
    return api.delete(`/inventory-records/${id}`);
  },
};
// Employee API methods
export const employeeAPI = {
  getAll: () => {
    console.log('🔄 Calling employeeAPI.getAll()');
    return api.get('/employees');
  },
  getById: (id) => {
    console.log('🔍 Calling employeeAPI.getById() with id:', id);
    return api.get(`/employees/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling employeeAPI.create() with data:', data);
    return api.post('/employees', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling employeeAPI.update() with id:', id, 'data:', data);
    return api.put(`/employees/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling employeeAPI.delete() with id:', id);
    return api.delete(`/employees/${id}`);
  },
};
 // Payment API methods
export const paymentsAPI = {
  getAll: () => {
    console.log('🔄 Calling paymentsAPI.getAll()');
    return api.get('/payments');
  },
  getById: (id) => {
    console.log('🔍 Calling paymentsAPI.getById() with id:', id);
    return api.get(`/payments/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling paymentsAPI.create() with data:', data);
    return api.post('/payments', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling paymentsAPI.update() with id:', id, 'data:', data);
    return api.put(`/payments/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling paymentsAPI.delete() with id:', id);
    return api.delete(`/payments/${id}`);
  },
};

// Bills API methods
export const billsAPI = {
  getAll: () => {
    console.log('🔄 Calling billsAPI.getAll()');
    return api.get('/bills');
  },
  getById: (id) => {
    console.log('🔍 Calling billsAPI.getById() with id:', id);
    return api.get(`/bills/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling billsAPI.create() with data:', data);
    return api.post('/bills', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling billsAPI.update() with id:', id, 'data:', data);
    return api.put(`/bills/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling billsAPI.delete() with id:', id);
    return api.delete(`/bills/${id}`);
  },
};
export const labQualityTestsAPI = {
  getAll: () => {
    console.log('🔄 Calling labQualityTestsAPI.getAll()');
    return api.get('/lab-quality-tests');
  },
  getById: (id) => {
    console.log('🔍 Calling labQualityTestsAPI.getById() with id:', id);
    return api.get(`/lab-quality-tests/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling labQualityTestsAPI.create() with data:', data);
    return api.post('/lab-quality-tests', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling labQualityTestsAPI.update() with id:', id, 'data:', data);
    return api.put(`/lab-quality-tests/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling labQualityTestsAPI.delete() with id:', id);
    return api.delete(`/lab-quality-tests/${id}`);
  },
};
export const reviewsAPI = {
  getAll: () => {
    console.log('🔄 Calling reviewsAPI.getAll()');
    return api.get('/reviews');
  },
  create: (data) => {
    console.log('➕ Calling reviewsAPI.create() with data:', data);
    return api.post('/reviews', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling reviewsAPI.update() with id:', id, 'data:', data);
    return api.put(`/reviews/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling reviewsAPI.delete() with id:', id);
    return api.delete(`/reviews/${id}`);
  }
};
 
export const farmerFeedbackAPI = {
    getAll: () => {
        console.log('🔄 Calling farmerFeedbackAPI.getAll()');
        return api.get('/farmer-feedback');
    },
    getById: (id) => {
        console.log('🔍 Calling farmerFeedbackAPI.getById() with id:', id);
        return api.get(`/farmer-feedback/${id}`);
    },
    create: (data) => {
        console.log('➕ Calling farmerFeedbackAPI.create() with data:', data);
        return api.post('/farmer-feedback', data);
    },
    update: (id, data) => {
        console.log('✏️ Calling farmerFeedbackAPI.update() with id:', id, 'data:', data);
        return api.put(`/farmer-feedback/${id}`, data);
    },
    delete: (id) => {
        console.log('🗑️ Calling farmerFeedbackAPI.delete() with id:', id);
        return api.delete(`/farmer-feedback/${id}`);
    },
};
export const messagesAPI = {
  getAll: () => {
    console.log('🔄 Calling messagesAPI.getAll()');
    return api.get('/messages');
  },
  getById: (id) => {
    console.log('🔍 Calling messagesAPI.getById() with id:', id);
    return api.get(`/messages/${id}`);
  },
  getByFarmerId: (farmerId) => {
    console.log('🔍 Calling messagesAPI.getByFarmerId() with farmerId:', farmerId);
    return api.get(`/messages/farmer/${farmerId}`);
  },
  create: (data) => {
    console.log('➕ Calling messagesAPI.create() with data:', data);
    return api.post('/messages', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling messagesAPI.update() with id:', id, 'data:', data);
    return api.put(`/messages/${id}`, data);
  },
  updateStatus: (id, status) => {
    console.log('🔄 Calling messagesAPI.updateStatus() with id:', id, 'status:', status);
    return api.patch(`/messages/${id}/status`, { status });
  },
  delete: (id) => {
    console.log('🗑️ Calling messagesAPI.delete() with id:', id);
    return api.delete(`/messages/${id}`);
  },
  getStats: () => {
    console.log('📊 Calling messagesAPI.getStats()');
    return api.get('/messages/stats');
  },
};
// Announcements API methods
export const announcementsAPI = {
  getAll: () => {
    console.log('🔄 Calling announcementsAPI.getAll()');
    return api.get('/announcements');
  },
  getById: (id) => {
    console.log('🔍 Calling announcementsAPI.getById() with id:', id);
    return api.get(`/announcements/${id}`);
  },
  getByTargetAudience: (targetAudience) => {
    console.log('🔍 Calling announcementsAPI.getByTargetAudience() with targetAudience:', targetAudience);
    return api.get(`/announcements/target-audience/${targetAudience}`);
  },
  getByPriority: (priority) => {
    console.log('🔍 Calling announcementsAPI.getByPriority() with priority:', priority);
    return api.get(`/announcements/priority/${priority}`);
  },
  create: (data) => {
    console.log('➕ Calling announcementsAPI.create() with data:', data);
    return api.post('/announcements', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling announcementsAPI.update() with id:', id, 'data:', data);
    return api.put(`/announcements/${id}`, data);
  },
  updateStatus: (id, status) => {
    console.log('🔄 Calling announcementsAPI.updateStatus() with id:', id, 'status:', status);
    return api.patch(`/announcements/${id}/status`, { status });
  },
  updateViews: (id, views) => {
    console.log('👁️ Calling announcementsAPI.updateViews() with id:', id, 'views:', views);
    return api.patch(`/announcements/${id}/views`, { views });
  },
  delete: (id) => {
    console.log('🗑️ Calling announcementsAPI.delete() with id:', id);
    return api.delete(`/announcements/${id}`);
  },
  getStats: () => {
    console.log('📊 Calling announcementsAPI.getStats()');
    return api.get('/announcements/stats');
  },
  getPublished: () => {
    console.log('📢 Calling announcementsAPI.getPublished()');
    return api.get('/announcements/published');
  },
  getDraft: () => {
    console.log('📝 Calling announcementsAPI.getDraft()');
    return api.get('/announcements/draft');
  },
  getArchived: () => {
    console.log('🗃️ Calling announcementsAPI.getArchived()');
    return api.get('/announcements/archived');
  },
  incrementViews: (id) => {
    console.log('👁️ Calling announcementsAPI.incrementViews() with id:', id);
    return api.patch(`/announcements/${id}/increment-views`);
  }
};
// Add this to the existing api.js file
export const groupMessagesAPI = {
  getAll: () => {
    console.log('🔄 Calling groupMessagesAPI.getAll()');
    return api.get('/group-messages');
  },
  
  getById: (id) => {
    console.log('🔍 Calling groupMessagesAPI.getById() with id:', id);
    return api.get(`/group-messages/${id}`);
  },
  
  getByGroupName: (groupName) => {
    console.log('🔍 Calling groupMessagesAPI.getByGroupName() with groupName:', groupName);
    return api.get(`/group-messages/group/${groupName}`);
  },
  
  create: (data) => {
    console.log('➕ Calling groupMessagesAPI.create() with data:', data);
    return api.post('/group-messages', data);
  },
  
  update: (id, data) => {
    console.log('✏️ Calling groupMessagesAPI.update() with id:', id, 'data:', data);
    return api.put(`/group-messages/${id}`, data);
  },
  
  delete: (id) => {
    console.log('🗑️ Calling groupMessagesAPI.delete() with id:', id);
    return api.delete(`/group-messages/${id}`);
  },
  
  getStats: () => {
    console.log('📊 Calling groupMessagesAPI.getStats()');
    return api.get('/group-messages/stats');
  }
};
// Compliance Records API methods
export const complianceRecordsAPI = {
  getAll: () => {
    console.log('🔄 Calling complianceRecordsAPI.getAll()');
    return api.get('/compliance-records');
  },
  getById: (id) => {
    console.log('🔍 Calling complianceRecordsAPI.getById() with id:', id);
    return api.get(`/compliance-records/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling complianceRecordsAPI.create() with data:', data);
    return api.post('/compliance-records', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling complianceRecordsAPI.update() with id:', id, 'data:', data);
    return api.put(`/compliance-records/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling complianceRecordsAPI.delete() with id:', id);
    return api.delete(`/compliance-records/${id}`);
  },
  getStats: () => {
    console.log('📊 Calling complianceRecordsAPI.getStats()');
    return api.get('/compliance-records/stats');
  }
};

// Certifications API methods
export const certificationsAPI = {
  getAll: () => {
    console.log('🔄 Calling certificationsAPI.getAll()');
    return api.get('/certifications');
  },
  getById: (id) => {
    console.log('🔍 Calling certificationsAPI.getById() with id:', id);
    return api.get(`/certifications/${id}`);
  },
  create: (data) => {
    console.log('➕ Calling certificationsAPI.create() with data:', data);
    return api.post('/certifications', data);
  },
  update: (id, data) => {
    console.log('✏️ Calling certificationsAPI.update() with id:', id, 'data:', data);
    return api.put(`/certifications/${id}`, data);
  },
  delete: (id) => {
    console.log('🗑️ Calling certificationsAPI.delete() with id:', id);
    return api.delete(`/certifications/${id}`);
  },
  getStats: () => {
    console.log('📊 Calling certificationsAPI.getStats()');
    return api.get('/certifications/stats');
  },
  getExpiring: (days) => {
    console.log('⏰ Calling certificationsAPI.getExpiring() with days:', days);
    return api.get(`/certifications/expiring/${days}`);
  }
};



export default api;
