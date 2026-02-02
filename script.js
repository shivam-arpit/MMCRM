// script.js - UPDATED VERSION with Funnel Details Table

document.addEventListener("DOMContentLoaded", () => {
  console.log("SalesBuddy Application Initialized - with Funnel Details");

  // ========== SCREEN MANAGEMENT ==========
  const screens = {
    dashboard: document.getElementById('dashboardView'),
    sales: document.getElementById('salesScreen'),
    leads: document.getElementById('leadsScreen'),
    tasks: document.getElementById('tasksScreen'),
    leadDetail: document.getElementById('leadDetailScreen'),
    taskDetail: document.getElementById('taskDetailScreen'),
    taskForm: document.getElementById('taskFormScreen'),
    leadForm: document.getElementById('leadFormScreen'),
    opportunityForm: document.getElementById('opportunityFormScreen'),
    customerForm: document.getElementById('customerFormScreen'),
    visitForm: document.getElementById('visitFormScreen'),
    visitDetail: document.getElementById('visitDetailScreen'),
    notifications: document.getElementById('notificationsScreen'),
    ideas: document.getElementById('ideasScreen'),
    planner: document.getElementById('plannerScreen'),
    opportunities: document.getElementById('opportunitiesScreen'),
    opportunityDetail: document.getElementById('opportunityDetailScreen'),
    proposals: document.getElementById('proposalsScreen'),
    proposalDetail: document.getElementById('proposalDetailScreen'),
    customers: document.getElementById('customersScreen'),
    customerDetail: document.getElementById('customerDetailScreen'),
    complaints: document.getElementById('complaintsScreen'),
    visits: document.getElementById('visitsScreen'),
    complaintDetail: document.getElementById('complaintDetailScreen'),
    complaintForm: document.getElementById('complaintFormScreen')
  };

  let currentScreen = 'dashboard';
  let screenHistory = [];
  let currentVisitId = null;

  const showScreen = (screenId) => {
    // Hide all screens
    Object.values(screens).forEach(screen => {
      if (screen) {
        screen.classList.remove('active');
        screen.classList.add('hidden');
      }
    });

    // Show selected screen
    const screen = screens[screenId];
    if (screen) {
      screen.classList.remove('hidden');
      setTimeout(() => {
        screen.classList.add('active');
        screen.scrollTop = 0;
      }, 10);
      
      if (screenId !== currentScreen) {
        screenHistory.push(screenId);
        currentScreen = screenId;
      }
      
      // Load data for specific screens
      if (screenId === 'sales') {
        // Initialize charts when sales screen is shown
        setTimeout(() => {
          initializeSalesCharts();
        }, 100);
      }
    }
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      screenHistory.pop();
      const prevScreen = screenHistory[screenHistory.length - 1];
      if (prevScreen && screens[prevScreen]) {
        showScreen(prevScreen);
      } else {
        showScreen('dashboard');
      }
    } else {
      showScreen('dashboard');
    }
  };

  // ========== FUNNEL DETAILS FUNCTIONALITY ==========
  // ========== INTERACTIVE FUNNEL DETAILS ==========
function setupFunnelDetails() {
  const funnelContainer = document.querySelector('.funnel-container');
  const funnelDetailsModal = document.getElementById('funnelDetailsModal');
  const closeFunnelDetailsBtn = document.getElementById('closeFunnelDetails');
  const funnelTableBody = document.getElementById('funnelTableBody');
  const funnelTimeRangeSelect = document.getElementById('funnelTimeRange');

  // Stage data mapping
  const stageData = {
    'leads': {
      title: 'Leads List',
      icon: '👤',
      filterFunction: () => Object.keys(mockData.leads).map(id => ({
        ...mockData.leads[id],
        id: id,
        type: 'lead'
      }))
    },
    'qualified': {
      title: 'Qualified Opportunities',
      icon: '✅',
      filterFunction: () => Object.values(mockData.opportunities).filter(opp => 
        ['discovery', 'proposal', 'negotiation'].includes(opp.stage.toLowerCase())
      ).map((opp, index) => ({
        ...opp,
        id: `opp-${index}`,
        type: 'opportunity'
      }))
    },
    'proposals': {
      title: 'Proposals List',
      icon: '📄',
      filterFunction: () => Object.keys(mockData.proposals).map(id => ({
        ...mockData.proposals[id],
        id: id,
        type: 'proposal'
      }))
    },
    'won': {
      title: 'Won Deals',
      icon: '💰',
      filterFunction: () => Object.values(mockData.opportunities).filter(opp => 
        opp.stage.toLowerCase() === 'closed-won'
      ).map((opp, index) => ({
        ...opp,
        id: `won-${index}`,
        type: 'opportunity'
      }))
    }
  };

  // Function to open funnel details
  function openFunnelDetails(stage = null) {
    if (funnelDetailsModal) {
      funnelDetailsModal.classList.remove('hidden');
      
      if (stage) {
        showStageItems(stage);
      } else {
        showFunnelOverview();
      }
    }
  }

  // Function to show funnel overview (default)
  function showFunnelOverview() {
    if (!funnelTableBody) return;
    
    funnelTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="funnel-overview">
          <h4>📊 Sales Funnel Overview</h4>
          <p>Click on any stage below to view the actual items in that stage</p>
          
          <div class="stage-cards-overview">
            <div class="stage-card" data-stage="leads">
              <div class="stage-card-icon">👤</div>
              <div class="stage-card-content">
                <h5>Leads</h5>
                <div class="stage-count">156</div>
                <p class="stage-desc">Potential customers</p>
              </div>
              <button class="view-stage-btn">
                <i class="fas fa-eye"></i> View All
              </button>
            </div>
            
            <div class="stage-card" data-stage="qualified">
              <div class="stage-card-icon">✅</div>
              <div class="stage-card-content">
                <h5>Qualified</h5>
                <div class="stage-count">78</div>
                <p class="stage-desc">Evaluated opportunities</p>
              </div>
              <button class="view-stage-btn">
                <i class="fas fa-eye"></i> View All
              </button>
            </div>
            
            <div class="stage-card" data-stage="proposals">
              <div class="stage-card-icon">📄</div>
              <div class="stage-card-content">
                <h5>Proposals</h5>
                <div class="stage-count">24</div>
                <p class="stage-desc">Sent proposals</p>
              </div>
              <button class="view-stage-btn">
                <i class="fas fa-eye"></i> View All
              </button>
            </div>
            
            <div class="stage-card" data-stage="won">
              <div class="stage-card-icon">💰</div>
              <div class="stage-card-content">
                <h5>Won Deals</h5>
                <div class="stage-count">12</div>
                <p class="stage-desc">Closed deals</p>
              </div>
              <button class="view-stage-btn">
                <i class="fas fa-eye"></i> View All
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;
    
    // Add event listeners to stage cards
    document.querySelectorAll('.stage-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (!e.target.closest('.view-stage-btn')) {
          const stage = this.getAttribute('data-stage');
          showStageItems(stage);
        }
      });
    });
    
    document.querySelectorAll('.view-stage-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const stage = this.closest('.stage-card').getAttribute('data-stage');
        showStageItems(stage);
      });
    });
  }

  // Function to show items for a specific stage
  function showStageItems(stageName) {
    if (!funnelTableBody) return;
    
    const stage = stageData[stageName] || stageData.leads;
    const items = stage.filterFunction();
    
    funnelTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="stage-header">
            <button class="back-to-overview" id="backToOverview">
              <i class="fas fa-arrow-left"></i> Back to Funnel
            </button>
            <h4><span class="stage-icon">${stage.icon}</span> ${stage.title}</h4>
            <div class="stage-summary">
              <span class="item-count">${items.length} items</span>
            </div>
          </div>
          
          <div class="stage-items-list">
            ${items.length > 0 ? items.map(item => `
              <div class="stage-item" data-id="${item.id}" data-type="${item.type}">
                <div class="item-icon">
                  <div class="icon-box ${item.type === 'lead' ? 'blue' : item.type === 'opportunity' ? 'green' : 'purple'}">
                    ${item.type === 'lead' ? '👤' : item.type === 'proposal' ? '📄' : '💰'}
                  </div>
                </div>
                <div class="item-info">
                  <div class="item-header">
                    <h5>${item.name || item.title || 'Untitled'}</h5>
                    ${item.status ? `<span class="item-status ${item.status.toLowerCase()}">${item.status}</span>` : ''}
                    ${item.stage ? `<span class="item-stage ${item.stage.toLowerCase().replace(' ', '-')}">${item.stage}</span>` : ''}
                  </div>
                  <p class="item-desc">
                    ${item.company || item.description || 'No description'}
                  </p>
                  <div class="item-meta">
                    ${item.assignedTo ? `<span><i class="fas fa-user"></i> ${item.assignedTo}</span>` : ''}
                    ${item.value ? `<span><i class="fas fa-rupee-sign"></i> ${item.value}</span>` : ''}
                    ${item.lastContact ? `<span><i class="fas fa-calendar"></i> ${item.lastContact}</span>` : ''}
                  </div>
                </div>
                <button class="view-item-btn" data-id="${item.id}" data-type="${item.type}">
                  <i class="fas fa-eye"></i> View
                </button>
              </div>
            `).join('') : `
              <div class="empty-stage">
                <div class="empty-icon">📭</div>
                <h5>No items found</h5>
                <p>There are no items in this stage yet.</p>
              </div>
            `}
          </div>
        </td>
      </tr>
    `;
    
    // Add event listener for back button
    const backBtn = document.getElementById('backToOverview');
    if (backBtn) {
      backBtn.addEventListener('click', showFunnelOverview);
    }
    
    // Add event listeners for view item buttons
    document.querySelectorAll('.view-item-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        const itemType = this.getAttribute('data-type');
        viewItemDetails(itemId, itemType);
      });
    });
    
    // Add event listeners for entire item row
    document.querySelectorAll('.stage-item').forEach(item => {
      item.addEventListener('click', function(e) {
        if (!e.target.closest('.view-item-btn')) {
          const itemId = this.getAttribute('data-id');
          const itemType = this.getAttribute('data-type');
          viewItemDetails(itemId, itemType);
        }
      });
    });
  }

  // Function to view individual item details
  function viewItemDetails(itemId, itemType) {
    let detailScreen = '';
    let itemData = null;
    
    switch(itemType) {
      case 'lead':
        detailScreen = 'leadDetail';
        itemData = mockData.leads[itemId];
        if (itemData) {
          loadLeadDetail(itemId);
        }
        break;
      case 'opportunity':
        detailScreen = 'opportunityDetail';
        // Extract numeric ID if needed
        const oppId = itemId.replace('opp-', '').replace('won-', '');
        itemData = mockData.opportunities[oppId] || mockData.opportunities['1'];
        if (itemData) {
          loadOpportunityDetail(oppId);
        }
        break;
      case 'proposal':
        detailScreen = 'proposalDetail';
        itemData = mockData.proposals[itemId];
        if (itemData) {
          loadProposalDetail(itemId);
        }
        break;
    }
    
    if (detailScreen && itemData) {
      // Close funnel modal
      if (funnelDetailsModal) {
        funnelDetailsModal.classList.add('hidden');
      }
      
      // Navigate to detail screen
      showScreen(detailScreen);
    }
  }

  // Event Listeners
  if (funnelContainer) {
    funnelContainer.addEventListener('click', (e) => {
      if (!e.target.closest('.funnel-nav')) {
        openFunnelDetails();
      }
    });
  }

  if (closeFunnelDetailsBtn && funnelDetailsModal) {
    closeFunnelDetailsBtn.addEventListener('click', () => {
      funnelDetailsModal.classList.add('hidden');
    });
  }

  // Close modal on outside click
  if (funnelDetailsModal) {
    funnelDetailsModal.addEventListener('click', (e) => {
      if (e.target === funnelDetailsModal) {
        funnelDetailsModal.classList.add('hidden');
      }
    });
  }

  // Also make funnel stages clickable directly
  document.querySelectorAll('.funnel-stage').forEach((stage, index) => {
    const stageNames = ['leads', 'qualified', 'proposals', 'won'];
    if (index < stageNames.length) {
      stage.style.cursor = 'pointer';
      stage.addEventListener('click', () => {
        openFunnelDetails(stageNames[index]);
      });
    }
  });
}

  // ========== VISIT FORM - AUTO-GENERATE DATE/TIME ==========
  function autoGenerateVisitDateTime() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const roundedMinute = Math.ceil(currentMinute / 30) * 30;
    
    let startHour = currentHour;
    let startMinute = roundedMinute;
    
    if (startMinute >= 60) {
      startHour += 1;
      startMinute = 0;
    }
    
    if (startHour >= 24) {
      startHour = 9;
    }
    
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    
    let endHour = startHour + 1;
    let endMinute = startMinute + 30;
    
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }
    
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    const visitDateInput = document.getElementById('sbVisitDate');
    const visitStartTimeInput = document.getElementById('sbVisitStartTime');
    const visitEndTimeInput = document.getElementById('sbVisitEndTime');
    
    if (visitDateInput) {
      visitDateInput.value = tomorrowDate;
    }
    
    if (visitStartTimeInput) {
      visitStartTimeInput.value = startTime;
    }
    
    if (visitEndTimeInput) {
      visitEndTimeInput.value = endTime;
    }
    
    updateAutoGeneratedIndicators();
  }

  function updateAutoGeneratedIndicators() {
    const autoGenTexts = document.querySelectorAll('.auto-gen-text');
    autoGenTexts.forEach(text => {
      text.style.display = 'inline';
      text.style.color = '#22c55e';
      text.style.fontSize = '0.8rem';
      text.style.fontWeight = '600';
    });
  }

  // ========== VISIT DETAIL - END VISIT FUNCTIONALITY ==========
  function updateEndVisitButtonVisibility() {
    const endVisitSection = document.getElementById('endVisitSection');
    const statusButtons = document.querySelectorAll('.status-buttons .status-btn');
    
    if (!endVisitSection || !statusButtons.length) return;
    
    let isInProgress = false;
    statusButtons.forEach(button => {
      if (button.classList.contains('active') && button.dataset.status === 'in-progress') {
        isInProgress = true;
      }
    });
    
    endVisitSection.style.display = isInProgress ? 'block' : 'none';
  }

  function initVisitStatusButtons() {
    const statusButtons = document.querySelectorAll('#visitDetailScreen .status-btn');
    
    statusButtons.forEach(button => {
      button.addEventListener('click', function() {
        statusButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        if (currentVisitId && mockData.visits[currentVisitId]) {
          mockData.visits[currentVisitId].status = this.dataset.status;
          
          if (this.dataset.status === 'completed') {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            const currentTimeRange = mockData.visits[currentVisitId].time;
            if (currentTimeRange && currentTimeRange.includes(' - ')) {
              const startTime = currentTimeRange.split(' - ')[0];
              mockData.visits[currentVisitId].time = `${startTime} - ${currentTime}`;
              mockData.visits[currentVisitId].duration = calculateDuration(startTime, currentTime);
              
              const timeEl = document.getElementById('visitDetailTime');
              if (timeEl) timeEl.textContent = `${startTime} - ${currentTime}`;
            }
            
            showToast('Visit marked as completed!');
          }
          
          loadVisitsData();
          updateEndVisitButtonVisibility();
        }
      });
    });
    
    const endVisitBtn = document.getElementById('endVisitBtn');
    if (endVisitBtn) {
      endVisitBtn.addEventListener('click', function() {
        const completedBtn = document.querySelector('#visitDetailScreen .status-btn[data-status="completed"]');
        if (completedBtn) {
          completedBtn.click();
          
          const now = new Date();
          const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          showToast(`Visit ended at ${currentTime}`);
        }
      });
    }
  }

  // ========== TOAST NOTIFICATION ==========
  function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
    
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      });
    }
  }

  // ========== NETWORK STATUS FUNCTIONALITY ==========
  const networkBtn = document.getElementById('networkBtn');
  const networkDropdown = document.getElementById('networkDropdown');
  const testNetworkBtn = document.getElementById('testNetworkBtn');
  const networkSpeedEl = document.getElementById('networkSpeed');
  const networkStrengthEl = document.getElementById('networkStrength');
  const networkLatencyEl = document.getElementById('networkLatency');
  const networkStatusBadge = document.querySelector('.network-status-badge');

  if (networkBtn && networkDropdown) {
    networkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      networkDropdown.classList.toggle('hidden');
      const notificationDropdown = document.getElementById('notificationDropdown');
      if (notificationDropdown) notificationDropdown.classList.add('hidden');
    });
  }

  if (testNetworkBtn) {
    testNetworkBtn.addEventListener('click', () => {
      testNetworkSpeed();
    });
  }

  function testNetworkSpeed() {
    if (!networkSpeedEl || !networkStrengthEl || !networkLatencyEl) return;
    
    networkSpeedEl.textContent = 'Testing...';
    networkSpeedEl.style.color = '#f59e0b';
    networkStrengthEl.textContent = 'Testing...';
    networkStrengthEl.style.color = '#f59e0b';
    networkLatencyEl.textContent = 'Testing...';
    networkLatencyEl.style.color = '#f59e0b';
    
    setTimeout(() => {
      const downloadSpeed = (Math.random() * 50 + 10).toFixed(1);
      const uploadSpeed = (Math.random() * 20 + 5).toFixed(1);
      const latency = Math.floor(Math.random() * 100 + 20);
      
      networkSpeedEl.textContent = `${downloadSpeed} Mbps / ${uploadSpeed} Mbps`;
      networkSpeedEl.style.color = '#22c55e';
      
      let strength = 'Excellent';
      let strengthColor = '#22c55e';
      if (parseFloat(downloadSpeed) < 20) {
        strength = 'Good';
        strengthColor = '#f59e0b';
      }
      if (parseFloat(downloadSpeed) < 10) {
        strength = 'Poor';
        strengthColor = '#ef4444';
      }
      
      networkStrengthEl.textContent = strength;
      networkStrengthEl.style.color = strengthColor;
      
      networkLatencyEl.textContent = `${latency}ms`;
      networkLatencyEl.style.color = latency < 50 ? '#22c55e' : latency < 100 ? '#f59e0b' : '#ef4444';
      
      if (networkStatusBadge) {
        networkStatusBadge.textContent = strength === 'Poor' ? 'Slow' : 'Online';
        networkStatusBadge.className = `network-status-badge ${strength === 'Poor' ? 'offline' : 'online'}`;
      }
    }, 1500);
  }

  document.addEventListener('click', (e) => {
    const networkDropdown = document.getElementById('networkDropdown');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (networkDropdown && !e.target.closest('.network-status') && !e.target.closest('.network-dropdown')) {
      networkDropdown.classList.add('hidden');
    }
    if (notificationDropdown && !e.target.closest('.notification') && !e.target.closest('.notification-dropdown')) {
      notificationDropdown.classList.add('hidden');
    }
  });

  if (navigator.onLine) {
    testNetworkSpeed();
  } else {
    if (networkSpeedEl) networkSpeedEl.textContent = 'Offline';
    if (networkStrengthEl) networkStrengthEl.textContent = 'No Connection';
    if (networkLatencyEl) networkLatencyEl.textContent = 'N/A';
    if (networkStatusBadge) {
      networkStatusBadge.textContent = 'Offline';
      networkStatusBadge.className = 'network-status-badge offline';
    }
  }

  // ========== NOTIFICATIONS ==========
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const viewAllNotificationsBtn = document.getElementById('viewAllNotificationsBtn');
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const notificationCount = document.querySelector('.notification span');

  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('hidden');
      if (networkDropdown) networkDropdown.classList.add('hidden');
    });
  }

  if (viewAllNotificationsBtn) {
    viewAllNotificationsBtn.addEventListener('click', () => {
      showScreen('notifications');
      notificationDropdown.classList.add('hidden');
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      document.querySelectorAll('.notification-full-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      updateNotificationCount();
    });
  }

  document.querySelectorAll('.notification-dismiss').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const notificationItem = this.closest('.notification-full-item');
      if (notificationItem) {
        notificationItem.style.display = 'none';
        updateNotificationCount();
      }
    });
  });

  function updateNotificationCount() {
    if (!notificationCount) return;
    
    const unreadCount = document.querySelectorAll('.notification-full-item.unread').length;
    notificationCount.textContent = unreadCount > 0 ? unreadCount : '';
    
    const bellCount = document.querySelector('.notification span');
    if (bellCount) {
      bellCount.textContent = unreadCount > 0 ? unreadCount : '';
    }
  }

  document.querySelectorAll('#notificationsScreen .filter-option').forEach(option => {
    option.addEventListener('click', function() {
      this.closest('.filter-section').querySelectorAll('.filter-option').forEach(opt => {
        opt.classList.remove('active');
      });
      this.classList.add('active');
      
      const filter = this.dataset.filter || 'all';
      
      document.querySelectorAll('.notification-full-item').forEach(item => {
        const type = item.dataset.type;
        
        switch(filter) {
          case 'all':
            item.style.display = 'flex';
            break;
          case 'unread':
            item.style.display = item.classList.contains('unread') ? 'flex' : 'none';
            break;
          case 'tasks':
          case 'leads':
          case 'system':
            item.style.display = type === filter ? 'flex' : 'none';
            break;
        }
      });
    });
  });

  // ========== DASHBOARD CARD NAVIGATION ==========
  const salesTargetCard = document.getElementById('salesTargetCard');
  if (salesTargetCard) {
    salesTargetCard.addEventListener('click', () => {
      showScreen('sales');
    });
  }

  const tasksCard = document.getElementById('tasksCard');
  if (tasksCard) {
    tasksCard.addEventListener('click', () => {
      showScreen('tasks');
    });
  }

  const leadsCard = document.getElementById('leadsCard');
  if (leadsCard) {
    leadsCard.addEventListener('click', () => {
      showScreen('leads');
    });
  }

  const opportunitiesCard = document.getElementById('opportunitiesCard');
  if (opportunitiesCard) {
    opportunitiesCard.addEventListener('click', () => {
      showScreen('opportunities');
    });
  }

  const proposalsCard = document.getElementById('proposalsCard');
  if (proposalsCard) {
    proposalsCard.addEventListener('click', () => {
      showScreen('proposals');
    });
  }

  const customersCard = document.getElementById('customersCard');
  if (customersCard) {
    customersCard.addEventListener('click', () => {
      showScreen('customers');
    });
  }

  const complaintsCard = document.getElementById('complaintsCard');
  if (complaintsCard) {
    complaintsCard.addEventListener('click', () => {
      showScreen('complaints');
    });
  }

  const visitsCard = document.getElementById('visitsCard');
  if (visitsCard) {
    visitsCard.addEventListener('click', () => {
      loadVisitsData();
      showScreen('visits');
    });
  }

  // ========== BACK BUTTONS ==========
  const backButtons = {
    sales: document.getElementById('backFromSales'),
    leads: document.getElementById('backFromLeads'),
    tasks: document.getElementById('backFromTasks'),
    leadDetail: document.getElementById('backFromLeadDetail'),
    taskDetail: document.getElementById('backFromTaskDetail'),
    taskForm: document.getElementById('backFromTaskForm'),
    leadForm: document.getElementById('backFromLeadForm'),
    opportunityForm: document.getElementById('backFromOpportunityForm'),
    customerForm: document.getElementById('backFromCustomerForm'),
    visitForm: document.getElementById('backFromVisitForm'),
    visitDetail: document.getElementById('backFromVisitDetail'),
    notifications: document.getElementById('backFromNotifications'),
    ideas: document.getElementById('backFromIdeas'),
    planner: document.getElementById('backFromPlanner'),
    opportunities: document.getElementById('backFromOpportunities'),
    opportunityDetail: document.getElementById('backFromOpportunityDetail'),
    proposals: document.getElementById('backFromProposals'),
    proposalDetail: document.getElementById('backFromProposalDetail'),
    customers: document.getElementById('backFromCustomers'),
    customerDetail: document.getElementById('backFromCustomerDetail'),
    complaints: document.getElementById('backFromComplaints'),
    visits: document.getElementById('backFromVisits'),
    complaintDetail: document.getElementById('backFromComplaintDetail'),
    complaintForm: document.getElementById('backFromComplaintForm')
  };

  Object.values(backButtons).forEach(button => {
    if (button) {
      button.addEventListener('click', goBack);
    }
  });

  // ========== CREATE MENU (NAV FAB) ==========
  const navFab = document.getElementById('navFab');
  const createMenu = document.getElementById('createMenu');
  const closeCreateMenu = document.getElementById('closeCreateMenu');

  if (navFab && createMenu) {
    navFab.addEventListener('click', (e) => {
      e.stopPropagation();
      createMenu.classList.remove('hidden');
    });
  }

  if (closeCreateMenu && createMenu) {
    closeCreateMenu.addEventListener('click', () => {
      createMenu.classList.add('hidden');
    });
  }

  document.addEventListener('click', (e) => {
    if (createMenu && !createMenu.classList.contains('hidden')) {
      if (!e.target.closest('.nav-fab-container') && !e.target.closest('.create-menu')) {
        createMenu.classList.add('hidden');
      }
    }
  });

  // Create menu items
  document.querySelectorAll('.create-menu-item').forEach(item => {
    item.addEventListener('click', function() {
      const action = this.dataset.action;
      if (createMenu) createMenu.classList.add('hidden');
      
      switch(action) {
        case 'lead':
          showScreen('leadForm');
          break;
        case 'opportunity':
          showScreen('opportunityForm');
          break;
        case 'task':
          showScreen('taskForm');
          break;
        case 'customer':
          showScreen('customerForm');
          break;
        case 'visit':
          showScreen('visitForm');
          break;
        case 'complaint':
          showScreen('complaintForm');
          break;
        case 'proposal':
          showScreen('proposalForm');
          break;
      }
    });
  });

  // ========== EVENT FORM FUNCTIONALITY ==========
  const eventFormModal = document.getElementById('eventFormModal');
  const eventForm = document.getElementById('eventForm');
  const closeEventForm = document.getElementById('closeEventForm');
  const cancelEventForm = document.getElementById('cancelEventForm');
  const addEventBtn = document.getElementById('addEventBtn');

  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      openEventForm();
    });
  }

  function openEventForm(type = '') {
    const eventTypeSelect = document.getElementById('eventType');
    const eventDateInput = document.getElementById('eventDate');
    
    if (eventTypeSelect && type) {
      eventTypeSelect.value = type;
    }
    
    if (eventDateInput) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      eventDateInput.value = formattedDate;
    }
    
    if (eventFormModal) {
      eventFormModal.classList.remove('hidden');
    }
  }

  if (closeEventForm) {
    closeEventForm.addEventListener('click', () => {
      if (eventFormModal) eventFormModal.classList.add('hidden');
    });
  }

  if (cancelEventForm) {
    cancelEventForm.addEventListener('click', () => {
      if (eventFormModal) eventFormModal.classList.add('hidden');
    });
  }

  if (eventForm) {
    eventForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('eventTitle').value,
        type: document.getElementById('eventType').value,
        priority: document.getElementById('eventPriority').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        duration: document.getElementById('eventDuration').value,
        reminder: document.getElementById('eventReminder').value,
        description: document.getElementById('eventDescription').value,
        related: document.getElementById('eventRelated').value,
        location: document.getElementById('eventLocation').value
      };
      
      const newEvent = {
        id: Date.now(),
        title: formData.title,
        type: formData.type,
        priority: formData.priority,
        date: formData.date,
        time: formData.time,
        duration: `${formData.duration} min`,
        description: formData.description || 'No description provided.',
        location: formData.location || 'Not specified'
      };
      
      if (!mockData.plannerEvents) {
        mockData.plannerEvents = [];
      }
      mockData.plannerEvents.unshift(newEvent);
      
      loadPlannerEvents();
      alert('Event scheduled successfully!');
      this.reset();
      if (eventFormModal) eventFormModal.classList.add('hidden');
    });
  }

  document.addEventListener('click', (e) => {
    if (eventFormModal && !eventFormModal.classList.contains('hidden')) {
      if (!e.target.closest('.modal-content') && !e.target.closest('#addEventBtn')) {
        eventFormModal.classList.add('hidden');
      }
    }
  });

  // ========== TASK FORM HANDLING ==========
  const taskForm = document.getElementById('taskForm');
  const cancelTaskBtn = document.getElementById('cancelTaskBtn');

  if (taskForm) {
    taskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('sbTaskTitle').value,
        description: document.getElementById('sbTaskDescription').value,
        associateWith: document.getElementById('sbAssociateWith').value,
        opportunity: document.getElementById('sbTaskOpportunity').value,
        taskType: document.getElementById('sbTaskType').value,
        assignTo: document.getElementById('sbTaskAssignTo').value,
        startDate: document.getElementById('sbTaskStartDate').value,
        startTime: document.getElementById('sbTaskStartTime').value,
        endDate: document.getElementById('sbTaskEndDate').value,
        endTime: document.getElementById('sbTaskEndTime').value,
        priority: document.getElementById('sbTaskPriority').value,
        status: document.getElementById('sbTaskStatus').value,
        personToMeet: document.getElementById('sbTaskPersonToMeet').value,
        reminder: document.getElementById('sbTaskReminder').value,
        notificationPerson: document.getElementById('sbTaskNotificationPerson').value,
        notificationType: document.getElementById('sbTaskNotificationType').value,
        comments: document.getElementById('sbTaskComments').value
      };
      
      const newTaskId = Object.keys(mockData.tasks).length + 1;
      const relatedLead = getRelatedLeadName(formData.opportunity);
      
      mockData.tasks[newTaskId] = {
        title: formData.title,
        description: formData.description || 'No description provided.',
        priority: formData.priority || 'Medium',
        status: formData.status || 'pending',
        assignedTo: formData.assignTo || 'Self',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        startTime: formData.startTime || '09:00',
        endDate: formData.endDate,
        endTime: formData.endTime,
        taskType: formData.taskType || 'follow-up',
        opportunity: formData.opportunity || 'None',
        personToMeet: formData.personToMeet,
        reminder: formData.reminder,
        comments: formData.comments
      };
      
      alert('Task created successfully!');
      showScreen('tasks');
      this.reset();
    });
  }

  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener('click', () => {
      showScreen('tasks');
    });
  }

  // ========== LEAD FORM HANDLING ==========
  const leadForm = document.getElementById('salesbuddyLeadForm');
  const cancelLeadBtn = document.getElementById('cancelLeadBtn');
  const addAgencyBtn = document.getElementById('addAgencyBtn');

  if (addAgencyBtn) {
    addAgencyBtn.addEventListener('click', () => {
      const agencyName = prompt('Enter new agency name:');
      if (agencyName) {
        const agencyInput = document.getElementById('sbAgency');
        if (agencyInput) {
          agencyInput.value = agencyName;
        }
      }
    });
  }

  const leadFormUploadBtn = document.getElementById('leadFormUploadBtn');
  const leadFormFileInput = document.getElementById('leadFormFileInput');
  const leadFormUploadedFiles = document.getElementById('leadFormUploadedFiles');

  if (leadFormUploadBtn && leadFormFileInput) {
    leadFormUploadBtn.addEventListener('click', () => {
      leadFormFileInput.click();
    });

    leadFormFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, leadFormUploadedFiles);
      });
    });
  }

  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('sbLeadName').value,
        description: document.getElementById('sbLeadDescription').value,
        agency: document.getElementById('sbAgency').value,
        client: document.getElementById('sbClient').value,
        mmProducts: document.getElementById('sbMmProducts').value,
        tag: document.getElementById('sbLeadTag').value,
        assignTo: document.getElementById('sbAssignTo').value,
        primaryContact: document.getElementById('sbPrimaryContact').value,
        clientContact: document.getElementById('sbClientContact').value,
        clientProduct: document.getElementById('sbClientProduct').value,
        brand: document.getElementById('sbBrand').value,
        industry: document.getElementById('sbIndustry').value,
        rollingMonth: document.getElementById('sbRollingMonth').value,
        source: document.getElementById('sbSource').value,
        mmDivision: document.getElementById('sbMmDivision').value,
        subDivision: document.getElementById('sbSubDivision').value,
        region: document.getElementById('sbRegion').value,
        status: document.getElementById('sbLeadStatus').value,
        notification: document.getElementById('sbSendNotification').value
      };
      
      const newLeadId = Object.keys(mockData.leads).length + 1;
      const initials = formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';
      
      mockData.leads[newLeadId] = {
        name: formData.name,
        company: formData.client || 'Unknown Company',
        status: formData.status || 'New',
        contactNumber: '+91 98765 43210',
        region: formData.region || 'Unknown',
        industry: formData.industry || 'Unknown',
        assignedTo: formData.assignTo || 'Unassigned',
        division: formData.mmDivision || 'Unknown',
        product: formData.mmProducts || 'Unknown',
        brand: formData.brand || 'Unknown',
        agency: formData.agency || 'Unknown',
        clientContact: formData.clientContact || 'Unknown',
        clientProduct: formData.clientProduct || 'Unknown',
        rollingMonth: formData.rollingMonth || 'Unknown',
        source: formData.source || 'Unknown',
        subDivision: formData.subDivision || 'Unknown',
        lastContact: new Date().toISOString().split('T')[0],
        tags: formData.tag ? [formData.tag] : [],
        initials: initials
      };
      
      alert('Lead created successfully!');
      showScreen('leads');
      this.reset();
      if (leadFormUploadedFiles) leadFormUploadedFiles.innerHTML = '';
    });
  }

  if (cancelLeadBtn) {
    cancelLeadBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // ========== OPPORTUNITY FORM ==========
  const opportunityForm = document.getElementById('salesbuddyOpportunityForm');
  const cancelOpportunityBtn = document.getElementById('cancelOpportunityBtn');
  const probabilityInput = document.getElementById('sbProbability');
  const probabilityValue = document.getElementById('sbProbabilityValue');
  const addOpportunityAgencyBtn = document.getElementById('addOpportunityAgencyBtn');
  const addOpportunityClientBtn = document.getElementById('addOpportunityClientBtn');

  if (probabilityInput && probabilityValue) {
    probabilityInput.addEventListener('input', function() {
      probabilityValue.textContent = `${this.value}%`;
    });
  }

  if (addOpportunityAgencyBtn) {
    addOpportunityAgencyBtn.addEventListener('click', () => {
      const agencyName = prompt('Enter new agency name:');
      if (agencyName) {
        const agencyInput = document.getElementById('sbOpportunityAgency');
        if (agencyInput) {
          agencyInput.value = agencyName;
        }
      }
    });
  }

  if (addOpportunityClientBtn) {
    addOpportunityClientBtn.addEventListener('click', () => {
      const clientName = prompt('Enter new client name:');
      if (clientName) {
        const clientInput = document.getElementById('sbOpportunityClient');
        if (clientInput) {
          clientInput.value = clientName;
        }
      }
    });
  }

  const opportunityFormUploadBtn = document.getElementById('opportunityFormUploadBtn');
  const opportunityFormFileInput = document.getElementById('opportunityFormFileInput');
  const opportunityFormUploadedFiles = document.getElementById('opportunityFormUploadedFiles');

  if (opportunityFormUploadBtn && opportunityFormFileInput) {
    opportunityFormUploadBtn.addEventListener('click', () => {
      opportunityFormFileInput.click();
    });

    opportunityFormFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, opportunityFormUploadedFiles);
      });
    });
  }

  if (opportunityForm) {
    opportunityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('sbOpportunityName').value,
        description: document.getElementById('sbOpportunityDescription').value,
        agency: document.getElementById('sbOpportunityAgency').value,
        client: document.getElementById('sbOpportunityClient').value,
        expectedValue: document.getElementById('sbExpectedValue').value,
        stage: document.getElementById('sbOpportunityStage').value,
        probability: document.getElementById('sbProbability').value,
        product: document.getElementById('sbOpportunityProducts').value,
        tag: document.getElementById('sbOpportunityTag').value,
        assignTo: document.getElementById('sbOpportunityAssignTo').value,
        primaryContact: document.getElementById('sbOpportunityPrimaryContact').value,
        clientContact: document.getElementById('sbOpportunityClientContact').value,
        clientProduct: document.getElementById('sbOpportunityClientProduct').value,
        brand: document.getElementById('sbOpportunityBrand').value,
        industry: document.getElementById('sbOpportunityIndustry').value,
        rollingMonth: document.getElementById('sbOpportunityRollingMonth').value,
        source: document.getElementById('sbOpportunitySource').value,
        division: document.getElementById('sbOpportunityMmDivision').value,
        subDivision: document.getElementById('sbOpportunitySubDivision').value,
        region: document.getElementById('sbOpportunityRegion').value,
        status: document.getElementById('sbOpportunityStatus').value,
        notification: document.getElementById('sbOpportunitySendNotification').value
      };
      
      const newOppId = Object.keys(mockData.opportunities).length + 1;
      const value = formData.expectedValue ? `₹${parseFloat(formData.expectedValue).toFixed(1)}L` : '₹0';
      
      mockData.opportunities[newOppId] = {
        title: formData.name,
        company: formData.client || 'Unknown Company',
        stage: formData.stage || 'Qualification',
        value: value,
        probability: parseInt(formData.probability) || 10,
        expectedClose: new Date().toISOString().split('T')[0],
        owner: formData.assignTo || 'Unassigned',
        description: formData.description || 'No description provided.',
        division: formData.division || 'Unknown',
        region: formData.region || 'Unknown',
        product: formData.product || 'Unknown',
        brand: formData.brand || 'Unknown',
        industry: formData.industry || 'Unknown',
        agency: formData.agency || 'Unknown',
        clientContact: formData.clientContact || 'Unknown',
        clientProduct: formData.clientProduct || 'Unknown',
        rollingMonth: formData.rollingMonth || 'Unknown',
        source: formData.source || 'Unknown',
        subDivision: formData.subDivision || 'Unknown'
      };
      
      alert('Opportunity created successfully!');
      showScreen('opportunities');
      this.reset();
      if (probabilityValue) {
        probabilityValue.textContent = '50%';
      }
      if (opportunityFormUploadedFiles) opportunityFormUploadedFiles.innerHTML = '';
    });
  }

  if (cancelOpportunityBtn) {
    cancelOpportunityBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // ========== CUSTOMER FORM ==========
  const customerForm = document.getElementById('salesbuddyCustomerForm');
  const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');

  if (customerForm) {
    customerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        companyName: document.getElementById('sbCustomerCompanyName').value,
        contactPerson: document.getElementById('sbCustomerContactPerson').value,
        email: document.getElementById('sbCustomerEmail').value,
        phone: document.getElementById('sbCustomerPhone').value,
        industry: document.getElementById('sbCustomerIndustry').value,
        website: document.getElementById('sbCustomerWebsite').value,
        address: document.getElementById('sbCustomerAddress').value,
        city: document.getElementById('sbCustomerCity').value,
        state: document.getElementById('sbCustomerState').value,
        country: document.getElementById('sbCustomerCountry').value,
        customerType: document.getElementById('sbCustomerType').value,
        annualRevenue: document.getElementById('sbCustomerAnnualRevenue').value,
        employeeCount: document.getElementById('sbCustomerEmployeeCount').value,
        status: document.getElementById('sbCustomerStatus').value,
        accountManager: document.getElementById('sbCustomerAccountManager').value,
        customerSince: document.getElementById('sbCustomerSince').value,
        notes: document.getElementById('sbCustomerNotes').value
      };
      
      const newCustomerId = Object.keys(mockData.customers).length + 1;
      const initials = formData.companyName ? formData.companyName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';
      const value = formData.annualRevenue ? `₹${parseFloat(formData.annualRevenue).toFixed(1)}L` : '₹0';
      
      mockData.customers[newCustomerId] = {
        name: formData.companyName,
        contact: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        location: `${formData.city || ''}, ${formData.state || ''}`.replace(/^,\s*|\s*,/g, '').trim() || 'Unknown',
        value: value,
        initials: initials,
        since: formData.customerSince || new Date().toISOString().split('T')[0],
        status: formData.status || 'active',
        industry: formData.industry || 'Unknown',
        address: formData.address,
        website: formData.website,
        customerType: formData.customerType,
        employeeCount: formData.employeeCount,
        accountManager: formData.accountManager || 'Unassigned',
        notes: formData.notes
      };
      
      alert('Customer created successfully!');
      showScreen('customers');
      this.reset();
    });
  }

  if (cancelCustomerBtn) {
    cancelCustomerBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // ========== VISIT FORM ==========
  const visitForm = document.getElementById('salesbuddyVisitForm');
  const cancelVisitBtn = document.getElementById('cancelVisitBtn');

  if (visitForm) {
    visitForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        customer: document.getElementById('sbVisitCustomer').value,
        date: document.getElementById('sbVisitDate').value,
        startTime: document.getElementById('sbVisitStartTime').value,
        endTime: document.getElementById('sbVisitEndTime').value,
        type: document.getElementById('sbVisitType').value,
        priority: document.getElementById('sbVisitPriority').value,
        location: document.getElementById('sbVisitLocation').value,
        contactPerson: document.getElementById('sbVisitContactPerson').value,
        contactPhone: document.getElementById('sbVisitContactPhone').value,
        objective: document.getElementById('sbVisitObjective').value,
        agenda: document.getElementById('sbVisitAgenda').value,
        materials: document.getElementById('sbVisitMaterials').value,
        travelMode: document.getElementById('sbVisitTravelMode').value,
        travelTime: document.getElementById('sbVisitTravelTime').value,
        expenses: document.getElementById('sbVisitExpenses').value,
        accommodation: document.getElementById('sbVisitAccommodation').value,
        followUpDate: document.getElementById('sbVisitFollowUpDate').value,
        followUpAction: document.getElementById('sbVisitFollowUpAction').value,
        assignedTo: document.getElementById('sbVisitAssignedTo').value
      };
      
      const newVisitId = Object.keys(mockData.visits).length + 1;
      const customerName = getCustomerNameById(formData.customer);
      const duration = calculateDuration(formData.startTime, formData.endTime);
      const title = `${customerName} ${formData.type || 'Meeting'}`;
      
      mockData.visits[newVisitId] = {
        id: newVisitId,
        title: title,
        customer: customerName,
        description: formData.objective ? (formData.objective.substring(0, 100) + '...') : 'No description',
        date: formData.date,
        time: `${formData.startTime || ''} - ${formData.endTime || ''}`,
        duration: duration,
        priority: formData.priority,
        status: 'scheduled',
        location: formData.location,
        contactPerson: formData.contactPerson,
        objective: formData.objective,
        agenda: formData.agenda ? formData.agenda.split('\n').filter(item => item.trim()) : [],
        materials: formData.materials,
        travelMode: formData.travelMode,
        travelTime: formData.travelTime,
        expenses: formData.expenses ? `₹${formData.expenses}` : '₹0',
        accommodation: formData.accommodation === 'yes' ? 'Required' : 'Not Required',
        followUpDate: formData.followUpDate,
        followUpAction: formData.followUpAction,
        assignedTo: formData.assignedTo || 'Unassigned'
      };
      
      alert('Visit scheduled successfully!');
      showScreen('visits');
      this.reset();
      autoGenerateVisitDateTime();
    });
  }

  if (cancelVisitBtn) {
    cancelVisitBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // ========== COMPLAINT FORM ==========
  const complaintForm = document.getElementById('salesbuddyComplaintForm');
  const cancelComplaintBtn = document.getElementById('cancelComplaintBtn');
  const complaintFormUploadBtn = document.getElementById('complaintFormUploadBtn');
  const complaintFormFileInput = document.getElementById('complaintFormFileInput');
  const complaintFormUploadedFiles = document.getElementById('complaintFormUploadedFiles');

  // Auto-fill contact information
  function autoFillComplaintContactInfo() {
    const complaintContactSelect = document.getElementById('sbComplaintContact');
    const complaintEmailInput = document.getElementById('sbComplaintEmail');
    const complaintPhoneInput = document.getElementById('sbComplaintPhone');
    const complaintCompanyInput = document.getElementById('sbComplaintCompany');

    if (complaintContactSelect) {
      complaintContactSelect.addEventListener('change', function() {
        const contactId = this.value;
        
        if (contactId && mockData.contacts && mockData.contacts[contactId]) {
          const contact = mockData.contacts[contactId];
          
          if (complaintEmailInput) complaintEmailInput.value = contact.email || '';
          if (complaintPhoneInput) complaintPhoneInput.value = contact.phone || '';
          if (complaintCompanyInput) complaintCompanyInput.value = contact.company || '';
        } else {
          if (complaintEmailInput) complaintEmailInput.value = '';
          if (complaintPhoneInput) complaintPhoneInput.value = '';
          if (complaintCompanyInput) complaintCompanyInput.value = '';
        }
      });
    }
  }

  // Upload functionality
  if (complaintFormUploadBtn && complaintFormFileInput) {
    complaintFormUploadBtn.addEventListener('click', () => {
      complaintFormFileInput.click();
    });

    complaintFormFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, complaintFormUploadedFiles);
      });
    });
  }

  // Form submission
  if (complaintForm) {
    complaintForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        contact: document.getElementById('sbComplaintContact').value,
        type: document.getElementById('sbComplaintType').value,
        description: document.getElementById('sbComplaintDescription').value,
        priority: document.getElementById('sbComplaintPriority').value,
        product: document.getElementById('sbComplaintProduct').value,
        assignedTo: document.getElementById('sbComplaintAssignedTo').value,
        email: document.getElementById('sbComplaintEmail').value,
        phone: document.getElementById('sbComplaintPhone').value,
        company: document.getElementById('sbComplaintCompany').value,
        reference: document.getElementById('sbComplaintReference').value,
        resolutionDate: document.getElementById('sbComplaintResolutionDate').value,
        status: document.getElementById('sbComplaintStatus').value
      };
      
      // Validate form
      const validationErrors = validateComplaintForm(formData);
      if (validationErrors.length > 0) {
        alert(`Please fix the following errors:\n\n• ${validationErrors.join('\n• ')}`);
        return;
      }
      
      // Create new complaint
      const newComplaintId = Object.keys(mockData.complaints).length + 1;
      
      // Get contact info
      let contactName = 'Unknown Contact';
      let customerCompany = formData.company || 'Unknown Company';
      
      if (mockData.contacts && mockData.contacts[formData.contact]) {
        const contact = mockData.contacts[formData.contact];
        contactName = contact.name;
        customerCompany = contact.company || customerCompany;
      }
      
      // Generate title
      const typeTitles = {
        'technical': 'Technical Issue',
        'billing': 'Billing Issue',
        'product': 'Product Quality Issue',
        'service': 'Service Quality Issue',
        'delivery': 'Delivery Issue',
        'other': 'Customer Complaint'
      };
      
      const title = `${typeTitles[formData.type] || 'Complaint'} - ${customerCompany}`;
      
      // Get product name
      let productName = formData.product;
      if (mockData.products && mockData.products[formData.product]) {
        productName = mockData.products[formData.product];
      }
      
      // Get assignee name
      let assignedToName = formData.assignedTo;
      if (mockData.assignees && mockData.assignees[formData.assignedTo]) {
        assignedToName = mockData.assignees[formData.assignedTo];
      }
      
      // Create complaint object
      mockData.complaints[newComplaintId] = {
        id: newComplaintId,
        title: title,
        customer: customerCompany,
        contactPerson: contactName,
        type: formData.type,
        priority: formData.priority,
        status: formData.status || 'pending',
        description: formData.description,
        product: productName,
        assignedTo: assignedToName,
        email: formData.email || '',
        phone: formData.phone || '',
        reference: formData.reference || '',
        resolutionDate: formData.resolutionDate || '',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      // Show success message
      showToast('Complaint submitted successfully!', 'success');

      // Go to complaints screen
      showScreen('complaints');

      // Reset form
      this.reset();
      if (complaintFormUploadedFiles) complaintFormUploadedFiles.innerHTML = '';
    });
  }

  if (cancelComplaintBtn) {
    cancelComplaintBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // Complaint form validation
  function validateComplaintForm(formData) {
    const errors = [];
    
    if (!formData.contact) {
      errors.push('Contact person is required');
    }
    
    if (!formData.type) {
      errors.push('Complaint type is required');
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    if (!formData.priority) {
      errors.push('Priority is required');
    }
    
    if (!formData.product) {
      errors.push('Product is required');
    }
    
    if (!formData.assignedTo) {
      errors.push('Assigned to is required');
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      errors.push('Valid email address is required');
    }
    
    return errors;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper functions
  function getCustomerNameById(customerId) {
    if (!customerId) return 'Unknown Customer';
    
    const customer = Object.values(mockData.customers).find(c => 
      c.id === customerId || c.name === customerId
    );
    
    if (customer) return customer.name;
    
    const mapping = {
      '1': 'Acme Corporation',
      '2': 'Global Tech Solutions',
      '3': 'Tech Innovations Inc',
      'acme': 'Acme Corporation',
      'global': 'Global Tech Solutions',
      'tech': 'Tech Innovations Inc'
    };
    
    return mapping[customerId.toLowerCase()] || 'Unknown Customer';
  }

  function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 'N/A';
    
    try {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diff = (end - start) / (1000 * 60);
      
      if (diff < 60) {
        return `${diff} min`;
      } else {
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
      }
    } catch (e) {
      return 'N/A';
    }
  }

  function addUploadedFile(file, container) {
    if (!container) return;
    
    const fileElement = document.createElement('div');
    fileElement.className = 'uploaded-file-item';
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    
    fileElement.innerHTML = `
      <div class="file-icon">${fileIcon}</div>
      <div class="file-info">
        <p class="file-name">${file.name}</p>
        <span class="file-size">${fileSize}</span>
      </div>
      <button class="remove-file-btn" type="button">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    const removeBtn = fileElement.querySelector('.remove-file-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        fileElement.remove();
      });
    }
    
    container.appendChild(fileElement);
  }

  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf':
        return '<i class="fas fa-file-pdf"></i>';
      case 'doc':
      case 'docx':
        return '<i class="fas fa-file-word"></i>';
      case 'xls':
      case 'xlsx':
        return '<i class="fas fa-file-excel"></i>';
      case 'ppt':
      case 'pptx':
        return '<i class="fas fa-file-powerpoint"></i>';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '<i class="fas fa-file-image"></i>';
      default:
        return '<i class="fas fa-file"></i>';
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getRelatedLeadName(relatedTo) {
    if (!relatedTo) return null;
    
    const mapping = {
      'lead-1': 'John Smith - Tech Innovations',
      'lead-2': 'Sarah Johnson - Digital Solutions',
      'opp-1': 'Enterprise Software License',
      'opp-2': 'Cloud Migration Project'
    };
    
    return mapping[relatedTo] || null;
  }

  // ========== MOCK DATA ==========
  const mockData = {
    leads: {
      '1': {
        name: 'John Smith',
        company: 'Tech Innovations Inc',
        status: 'Hot',
        contactNumber: '+91 98765 43210',
        region: 'North India',
        industry: 'Technology',
        division: 'Enterprise Division',
        product: 'Enterprise Suite',
        brand: 'TechBrand',
        assignedTo: 'Rahul Kumar',
        lastContact: '2024-03-15',
        tags: ['Enterprise', 'Q1 Priority', 'Decision Maker'],
        initials: 'JS',
        agency: 'Digital Marketing Agency',
        clientContact: 'john@techinnovations.com',
        clientProduct: 'CRM Software',
        rollingMonth: 'March 2024',
        source: 'Website',
        subDivision: 'Enterprise Sales'
      },
      '2': {
        name: 'Sarah Johnson',
        company: 'Digital Solutions',
        status: 'Warm',
        contactNumber: '+91 98765 43211',
        region: 'West India',
        industry: 'Digital Services',
        division: 'Digital Division',
        product: 'Marketing Suite',
        brand: 'DigitalBrand',
        assignedTo: 'Priya Sharma',
        lastContact: '2024-03-14',
        tags: ['SMB', 'Marketing'],
        initials: 'SJ',
        agency: 'Web Solutions Agency',
        clientContact: 'sarah@digitalsolutions.com',
        clientProduct: 'E-commerce Platform',
        rollingMonth: 'March 2024',
        source: 'Referral',
        subDivision: 'Digital Marketing'
      }
    },
    tasks: {
      '1': {
        title: 'Follow up with ABC Corp',
        description: 'Call John Smith to discuss the enterprise license proposal.',
        priority: 'High',
        time: '10:00 AM',
        assignedTo: 'Rahul Kumar',
        dueDate: '2024-03-18',
        relatedLead: 'John Smith - Tech Innovations'
      },
      '2': {
        title: 'Prepare proposal for XYZ Ltd',
        description: 'Create comprehensive proposal including pricing, timeline, and implementation plan.',
        priority: 'Medium',
        time: '11:30 AM',
        assignedTo: 'Priya Sharma',
        dueDate: '2024-03-19',
        relatedLead: 'Sarah Johnson - Digital Solutions'
      }
    },
    opportunities: {
      '1': {
        title: 'Enterprise Software License',
        company: 'ABC Corporation',
        stage: 'Negotiation',
        value: '₹12.5L',
        probability: 80,
        expectedClose: '2024-04-15',
        owner: 'Rahul Kumar',
        description: 'Full enterprise license for 500 users including premium support and training.',
        division: 'Enterprise Division',
        region: 'North India',
        product: 'Enterprise Suite',
        brand: 'TechBrand',
        industry: 'Technology',
        agency: 'Digital Solutions Agency',
        clientContact: 'james@abccorp.com',
        clientProduct: 'Business Software',
        rollingMonth: 'April 2024',
        source: 'Referral',
        subDivision: 'Enterprise Sales'
      },
      '2': {
        title: 'Cloud Migration Project',
        company: 'XYZ Ltd',
        stage: 'Proposal',
        value: '₹8.3L',
        probability: 60,
        expectedClose: '2024-04-30',
        owner: 'Priya Sharma',
        description: 'Complete cloud migration and infrastructure setup.',
        division: 'Cloud Division',
        region: 'South India',
        product: 'Cloud Services',
        brand: 'CloudBrand',
        industry: 'Technology',
        agency: 'IT Solutions Agency',
        clientContact: 'mike@xyz.com',
        clientProduct: 'Infrastructure Services',
        rollingMonth: 'April 2024',
        source: 'Website',
        subDivision: 'Cloud Solutions'
      }
    },
    proposals: {
      '1': {
        title: 'Q1 Marketing Campaign',
        company: 'Brand Masters',
        status: 'pending',
        value: '₹9.5L',
        validUntil: '2024-04-01',
        owner: 'Rahul Kumar',
        description: 'Comprehensive digital marketing campaign including SEO, PPC, and social media management for Q1 2024.'
      },
      '2': {
        title: 'Website Redesign',
        company: 'Digital First',
        status: 'approved',
        value: '₹7.2L',
        validUntil: '2024-04-15',
        owner: 'Priya Sharma',
        description: 'Complete website redesign with modern UI/UX and responsive design.'
      }
    },
    customers: {
      '1': {
        name: 'Acme Corporation',
        contact: 'James Wilson',
        email: 'james@acme.com',
        phone: '+91 98765 43210',
        location: 'Mumbai',
        value: '₹45.2L',
        initials: 'AC',
        since: 'Jan 2022',
        status: 'active'
      },
      '2': {
        name: 'Global Tech Solutions',
        contact: 'Lisa Anderson',
        email: 'lisa@globaltech.com',
        phone: '+91 98765 43211',
        location: 'Bangalore',
        value: '₹38.5L',
        initials: 'GT',
        since: 'Mar 2021',
        status: 'active'
      },
      '3': {
        name: 'Tech Innovations Inc',
        contact: 'John Smith',
        email: 'john@techinnovations.com',
        phone: '+91 98765 43212',
        location: 'Delhi',
        value: '₹25.7L',
        initials: 'TI',
        since: 'Feb 2023',
        status: 'active'
      }
    },
    complaints: {
      '1': {
        title: 'Software Login Issues',
        customer: 'Acme Corporation',
        type: 'Technical',
        priority: 'high',
        status: 'investigating',
        createdAt: '2024-03-15',
        assignedTo: 'Tech Support',
        description: 'Multiple users at Acme Corporation are unable to access the system. Getting "Invalid credentials" error.',
        contactPerson: 'John Manager',
        contactEmail: 'john@acme.com',
        contactPhone: '+91 98765 43210'
      },
      '2': {
        title: 'Invoice Discrepancy',
        customer: 'Global Tech Solutions',
        type: 'Billing',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-03-14',
        assignedTo: 'Finance Team',
        description: 'Billing amount doesn\'t match the signed agreement.',
        contactPerson: 'Lisa Anderson',
        contactEmail: 'lisa@globaltech.com',
        contactPhone: '+91 98765 43211'
      }
    },
    visits: {
      '1': {
        id: 1,
        title: 'Quarterly Business Review',
        customer: 'Acme Corporation',
        description: 'Discuss Q1 performance and Q2 roadmap',
        date: '2024-03-18',
        time: '10:00 AM - 11:30 AM',
        duration: '1.5 hours',
        priority: 'high',
        status: 'scheduled',
        location: '123 Business St, Mumbai',
        contactPerson: 'James Wilson',
        objective: 'Discuss Q1 performance metrics and plan Q2 strategic initiatives.',
        agenda: ['Review Q1 performance metrics (30 mins)', 'Discuss customer feedback (20 mins)', 'Q2 roadmap presentation (30 mins)', 'Identify upsell opportunities (10 mins)'],
        materials: 'Laptop, presentation slides, sample reports, proposal documents.',
        travelMode: 'Car',
        travelTime: '2 hours',
        expenses: '₹1,500',
        accommodation: 'Not Required',
        followUpDate: '2024-03-25',
        followUpAction: 'Send Proposal',
        assignedTo: 'Rahul Kumar'
      }
    },
    contacts: {
      'john-smith': {
        name: 'John Smith',
        company: 'Tech Innovations Inc',
        email: 'john@techinnovations.com',
        phone: '+91 98765 43210'
      },
      'sarah-johnson': {
        name: 'Sarah Johnson',
        company: 'Digital Solutions',
        email: 'sarah@digitalsolutions.com',
        phone: '+91 98765 43211'
      },
      'james-wilson': {
        name: 'James Wilson',
        company: 'Acme Corporation',
        email: 'james@acme.com',
        phone: '+91 98765 43212'
      },
      'lisa-anderson': {
        name: 'Lisa Anderson',
        company: 'Global Tech Solutions',
        email: 'lisa@globaltech.com',
        phone: '+91 98765 43213'
      },
      'mike-chen': {
        name: 'Mike Chen',
        company: 'Tech Solutions Ltd',
        email: 'mike@techsolutions.com',
        phone: '+91 98765 43214'
      }
    },
    products: {
      'enterprise-suite': 'Enterprise Suite',
      'cloud-services': 'Cloud Services',
      'marketing-suite': 'Marketing Suite',
      'crm-software': 'CRM Software',
      'business-software': 'Business Software',
      'ecommerce-platform': 'E-commerce Platform'
    },
    assignees: {
      'tech-support': 'Tech Support Team',
      'finance-team': 'Finance Team',
      'customer-service': 'Customer Service',
      'product-team': 'Product Team',
      'rahul-kumar': 'Rahul Kumar',
      'priya-sharma': 'Priya Sharma',
      'amit-patel': 'Amit Patel'
    },
    complaintTypes: {
      'technical': 'Technical Issue',
      'billing': 'Billing/Invoice',
      'product': 'Product Quality',
      'service': 'Service Quality',
      'delivery': 'Delivery Issue',
      'other': 'Other'
    },
    insights: [
      {
        id: 1,
        type: "opportunity",
        title: "Upsell Opportunity Detected",
        description: "ABC Corp's usage has increased 40%. Consider proposing premium tier upgrade.",
        impact: "high"
      }
    ],
    plannerEvents: [
      {
        id: 1,
        title: "Discovery Call with ABC Corp",
        type: "call",
        time: "09:00 AM",
        duration: "30 min",
        attendees: ["John Smith"]
      }
    ]
  };

  // ========== DETAIL PAGE NAVIGATION ==========
  // Lead Cards
  document.querySelectorAll('.lead-card').forEach(leadCard => {
    leadCard.addEventListener('click', function(e) {
      if (!e.target.closest('.icon-btn') && !e.target.closest('.task-checkbox')) {
        const leadId = this.getAttribute('data-lead-id') || '1';
        loadLeadDetail(leadId);
        showScreen('leadDetail');
      }
    });
  });

  // Task Items
  document.querySelectorAll('.task-item').forEach(taskItem => {
    taskItem.addEventListener('click', function(e) {
      if (!e.target.closest('.task-checkbox input')) {
        const taskId = this.getAttribute('data-task-id') || '1';
        loadTaskDetail(taskId);
        showScreen('taskDetail');
      }
    });
  });

  // Opportunity Cards
  document.querySelectorAll('.opportunity-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const opportunityId = this.getAttribute('data-opportunity-id') || '1';
      loadOpportunityDetail(opportunityId);
      showScreen('opportunityDetail');
    });
  });

  // Proposal Cards
  document.querySelectorAll('.proposal-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const proposalId = this.getAttribute('data-proposal-id') || '1';
      loadProposalDetail(proposalId);
      showScreen('proposalDetail');
    });
  });

  // Customer Cards
  document.querySelectorAll('.customer-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const customerId = this.getAttribute('data-customer-id') || '1';
      loadCustomerDetail(customerId);
      showScreen('customerDetail');
    });
  });

  // Complaint Cards
  document.querySelectorAll('.complaint-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const complaintId = this.getAttribute('data-complaint-id') || '1';
      loadComplaintDetail(complaintId);
      showScreen('complaintDetail');
    });
  });

  // Visit Cards
  document.querySelectorAll('.visit-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('.icon-btn')) {
        const visitId = this.getAttribute('data-visit-id') || '1';
        loadVisitDetail(visitId);
        showScreen('visitDetail');
      }
    });
  });

  // ========== DETAIL PAGE LOADERS ==========
  function loadLeadDetail(leadId) {
    const data = mockData.leads[leadId] || mockData.leads['1'];
    
    const nameEl = document.getElementById('leadDetailName');
    const companyEl = document.getElementById('leadDetailCompany');
    const statusEl = document.getElementById('leadDetailStatus');
    const leadNameEl = document.getElementById('leadDetailLeadName');
    const clientEl = document.getElementById('leadDetailClient');
    const contactEl = document.getElementById('leadDetailContactNumber');
    const regionEl = document.getElementById('leadDetailRegion');
    const industryEl = document.getElementById('leadDetailIndustry');
    const assignedEl = document.getElementById('leadDetailAssignedTo');
    const divisionEl = document.getElementById('leadDetailDivision');
    const productEl = document.getElementById('leadDetailProduct');
    const brandEl = document.getElementById('leadDetailBrand');
    const avatarEl = document.getElementById('leadDetailAvatar');
    const agencyEl = document.getElementById('leadDetailAgency');
    const clientContactEl = document.getElementById('leadDetailClientContact');
    const clientProductEl = document.getElementById('leadDetailClientProduct');
    const rollingMonthEl = document.getElementById('leadDetailRollingMonth');
    const sourceEl = document.getElementById('leadDetailSource');
    const subDivisionEl = document.getElementById('leadDetailSubDivision');
    
    if (nameEl) nameEl.textContent = data.name;
    if (companyEl) companyEl.textContent = data.company;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `lead-badge ${data.status.toLowerCase()}`;
    }
    if (leadNameEl) leadNameEl.textContent = data.name;
    if (clientEl) clientEl.textContent = data.company;
    if (contactEl) contactEl.textContent = data.contactNumber;
    if (regionEl) regionEl.textContent = data.region;
    if (industryEl) industryEl.textContent = data.industry;
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (divisionEl) divisionEl.textContent = data.division;
    if (productEl) productEl.textContent = data.product;
    if (brandEl) brandEl.textContent = data.brand;
    if (avatarEl) avatarEl.textContent = data.initials;
    if (agencyEl) agencyEl.textContent = data.agency;
    if (clientContactEl) clientContactEl.textContent = data.clientContact;
    if (clientProductEl) clientProductEl.textContent = data.clientProduct;
    if (rollingMonthEl) rollingMonthEl.textContent = data.rollingMonth;
    if (sourceEl) sourceEl.textContent = data.source;
    if (subDivisionEl) subDivisionEl.textContent = data.subDivision;
  }

  function loadOpportunityDetail(opportunityId) {
    const data = mockData.opportunities[opportunityId] || mockData.opportunities['1'];
    
    const titleEl = document.getElementById('opportunityDetailTitle');
    const companyEl = document.getElementById('opportunityDetailCompany');
    const stageEl = document.getElementById('opportunityDetailStage');
    const valueEl = document.getElementById('opportunityDetailValue');
    const probEl = document.getElementById('opportunityDetailProbability');
    const ownerEl = document.getElementById('opportunityDetailOwner');
    const descEl = document.getElementById('opportunityDetailDescription');
    const progressEl = document.getElementById('opportunityProgressBar');
    const revenueEl = document.getElementById('opportunityDetailExpectedRevenue');
    const divisionEl = document.getElementById('opportunityDetailDivision');
    const regionEl = document.getElementById('opportunityDetailRegion');
    const productEl = document.getElementById('opportunityDetailProduct');
    const brandEl = document.getElementById('opportunityDetailBrand');
    const industryEl = document.getElementById('opportunityDetailIndustry');
    const agencyEl = document.getElementById('opportunityDetailAgency');
    const clientContactEl = document.getElementById('opportunityDetailClientContact');
    const clientProductEl = document.getElementById('opportunityDetailClientProduct');
    const rollingMonthEl = document.getElementById('opportunityDetailRollingMonth');
    const sourceEl = document.getElementById('opportunityDetailSource');
    const subDivisionEl = document.getElementById('opportunityDetailSubDivision');
    
    if (titleEl) titleEl.textContent = data.title;
    if (companyEl) companyEl.textContent = data.company;
    if (stageEl) {
      stageEl.textContent = data.stage;
      stageEl.className = `opportunity-badge ${data.stage.toLowerCase().replace(' ', '-')}`;
    }
    if (valueEl) valueEl.textContent = data.value;
    if (probEl) probEl.textContent = `${data.probability}%`;
    if (ownerEl) ownerEl.textContent = data.owner;
    if (descEl) descEl.textContent = data.description;
    if (progressEl) progressEl.style.width = `${data.probability}%`;
    if (revenueEl) revenueEl.innerHTML = `Expected Revenue: <strong>${data.value}</strong>`;
    if (divisionEl) divisionEl.textContent = data.division;
    if (regionEl) regionEl.textContent = data.region;
    if (productEl) productEl.textContent = data.product;
    if (brandEl) brandEl.textContent = data.brand;
    if (industryEl) industryEl.textContent = data.industry;
    if (agencyEl) agencyEl.textContent = data.agency;
    if (clientContactEl) clientContactEl.textContent = data.clientContact;
    if (clientProductEl) clientProductEl.textContent = data.clientProduct;
    if (rollingMonthEl) rollingMonthEl.textContent = data.rollingMonth;
    if (sourceEl) sourceEl.textContent = data.source;
    if (subDivisionEl) subDivisionEl.textContent = data.subDivision;
  }

  function loadTaskDetail(taskId) {
    const data = mockData.tasks[taskId] || mockData.tasks['1'];
    
    const titleEl = document.getElementById('taskDetailTitle');
    const descEl = document.getElementById('taskDetailDescription');
    const priorityEl = document.getElementById('taskDetailPriority');
    const timeEl = document.getElementById('taskDetailTime');
    const assignedEl = document.getElementById('taskDetailAssignedTo');
    const dueDateEl = document.getElementById('taskDetailDueDate');
    const dateEl = document.getElementById('taskDetailDate');
    const relatedEl = document.getElementById('taskDetailRelatedLead');
    
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.description;
    if (priorityEl) {
      priorityEl.textContent = data.priority;
      priorityEl.className = `task-badge ${data.priority.toLowerCase()}`;
    }
    if (timeEl) timeEl.textContent = data.time;
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (dueDateEl) dueDateEl.textContent = data.dueDate;
    if (dateEl) dateEl.textContent = `Due ${data.dueDate}`;
    if (relatedEl) relatedEl.textContent = data.relatedLead;
  }

  function loadProposalDetail(proposalId) {
    const data = mockData.proposals[proposalId] || mockData.proposals['1'];
    
    const titleEl = document.getElementById('proposalDetailTitle');
    const companyEl = document.getElementById('proposalDetailCompany');
    const statusEl = document.getElementById('proposalDetailStatus');
    const valueEl = document.getElementById('proposalDetailValue');
    const probEl = document.getElementById('proposalDetailProbability');
    const clientEl = document.getElementById('proposalDetailClient');
    const agencyEl = document.getElementById('proposalDetailAgency');
    const ownerEl = document.getElementById('proposalDetailOwner');
    const descEl = document.getElementById('proposalDetailDescription');
    const divisionEl = document.getElementById('proposalDetailDivision');
    const regionEl = document.getElementById('proposalDetailRegion');
    const productEl = document.getElementById('proposalDetailProduct');
    const brandEl = document.getElementById('proposalDetailBrand');
    const industryEl = document.getElementById('proposalDetailIndustry');
    const clientContactEl = document.getElementById('proposalDetailClientContact');
    const clientProductEl = document.getElementById('proposalDetailClientProduct');
    const rollingMonthEl = document.getElementById('proposalDetailRollingMonth');
    const sourceEl = document.getElementById('proposalDetailSource');
    const subDivisionEl = document.getElementById('proposalDetailSubDivision');
    const progressEl = document.getElementById('proposalProgressBar');
    
    if (titleEl) titleEl.textContent = data.title;
    if (companyEl) companyEl.textContent = data.company;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `proposal-badge ${data.status}`;
    }
    if (valueEl) valueEl.textContent = data.value;
    if (probEl) probEl.textContent = `${data.probability || '75'}% probability`;
    if (clientEl) clientEl.textContent = data.client || data.company;
    if (agencyEl) agencyEl.textContent = data.agency || 'No agency';
    if (ownerEl) ownerEl.textContent = data.owner;
    if (descEl) descEl.textContent = data.description;
    if (divisionEl) divisionEl.textContent = data.division || 'Not specified';
    if (regionEl) regionEl.textContent = data.region || 'Not specified';
    if (productEl) productEl.textContent = data.product || 'Not specified';
    if (brandEl) brandEl.textContent = data.brand || 'Not specified';
    if (industryEl) industryEl.textContent = data.industry || 'Not specified';
    if (clientContactEl) clientContactEl.textContent = data.clientContact || 'Not specified';
    if (clientProductEl) clientProductEl.textContent = data.clientProduct || 'Not specified';
    if (rollingMonthEl) rollingMonthEl.textContent = data.rollingMonth || 'Not specified';
    if (sourceEl) sourceEl.textContent = data.source || 'Not specified';
    if (subDivisionEl) subDivisionEl.textContent = data.subDivision || 'Not specified';
    if (progressEl) progressEl.style.width = `${data.probability || 75}%`;
  }

  function loadCustomerDetail(customerId) {
    const data = mockData.customers[customerId] || mockData.customers['1'];
    
    const nameEl = document.getElementById('customerDetailName');
    const contactEl = document.getElementById('customerDetailContact');
    const emailEl = document.getElementById('customerDetailEmail');
    const phoneEl = document.getElementById('customerDetailPhone');
    const locationEl = document.getElementById('customerDetailLocation');
    const valueEl = document.getElementById('customerDetailValue');
    const sinceEl = document.getElementById('customerDetailSince');
    const statusEl = document.getElementById('customerDetailStatus');
    const avatarEl = document.getElementById('customerDetailAvatar');
    
    if (nameEl) nameEl.textContent = data.name;
    if (contactEl) contactEl.textContent = data.contact;
    if (emailEl) emailEl.textContent = data.email;
    if (phoneEl) phoneEl.textContent = data.phone;
    if (locationEl) locationEl.textContent = data.location;
    if (valueEl) valueEl.textContent = data.value;
    if (sinceEl) sinceEl.textContent = data.since;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `customer-badge ${data.status}`;
    }
    if (avatarEl) avatarEl.textContent = data.initials;
  }

  function loadComplaintDetail(complaintId) {
    const data = mockData.complaints[complaintId] || mockData.complaints['1'];
    
    const titleEl = document.getElementById('complaintDetailTitle');
    const customerEl = document.getElementById('complaintDetailCustomer');
    const typeEl = document.getElementById('complaintDetailType');
    const priorityEl = document.getElementById('complaintDetailPriority');
    const statusEl = document.getElementById('complaintDetailStatus');
    const createdEl = document.getElementById('complaintDetailCreatedAt');
    const assignedEl = document.getElementById('complaintDetailAssignedTo');
    const descEl = document.getElementById('complaintDetailDescription');
    const contactPersonEl = document.getElementById('complaintDetailContactPerson');
    const contactEmailEl = document.getElementById('complaintDetailContactEmail');
    const contactPhoneEl = document.getElementById('complaintDetailContactPhone');
    
    if (titleEl) titleEl.textContent = data.title;
    if (customerEl) customerEl.textContent = data.customer;
    if (typeEl) typeEl.textContent = data.type;
    if (priorityEl) {
      priorityEl.textContent = data.priority;
      priorityEl.className = `complaint-priority-badge ${data.priority}`;
    }
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `complaint-status-badge ${data.status}`;
    }
    if (createdEl) createdEl.textContent = data.createdAt;
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (descEl) descEl.textContent = data.description;
    if (contactPersonEl) contactPersonEl.textContent = data.contactPerson;
    if (contactEmailEl) contactEmailEl.textContent = data.contactEmail;
    if (contactPhoneEl) contactPhoneEl.textContent = data.contactPhone;
  }

  function loadVisitDetail(visitId) {
    currentVisitId = visitId;
    const data = mockData.visits[visitId] || mockData.visits['1'];
    
    const titleEl = document.getElementById('visitDetailTitle');
    const customerEl = document.getElementById('visitDetailCustomer');
    const typeEl = document.getElementById('visitDetailType');
    const priorityEl = document.getElementById('visitDetailPriority');
    const statusEl = document.getElementById('visitDetailStatus');
    const dateEl = document.getElementById('visitDetailDate');
    const timeEl = document.getElementById('visitDetailTime');
    const locationEl = document.getElementById('visitDetailLocation');
    const contactPersonEl = document.getElementById('visitDetailContactPerson');
    const contactPhoneEl = document.getElementById('visitDetailContactPhone');
    const assignedEl = document.getElementById('visitDetailAssignedTo');
    const objectiveEl = document.getElementById('visitDetailObjective');
    const agendaEl = document.getElementById('visitDetailAgenda');
    const materialsEl = document.getElementById('visitDetailMaterials');
    const travelModeEl = document.getElementById('visitDetailTravelMode');
    const travelTimeEl = document.getElementById('visitDetailTravelTime');
    const expensesEl = document.getElementById('visitDetailExpenses');
    const accommodationEl = document.getElementById('visitDetailAccommodation');
    const followUpDateEl = document.getElementById('visitDetailFollowUpDate');
    const followUpActionEl = document.getElementById('visitDetailFollowUpAction');
    const descriptionEl = document.getElementById('visitDetailDescription');
    
    if (titleEl) titleEl.textContent = data.title;
    if (customerEl) customerEl.textContent = data.customer;
    if (typeEl) {
      const typeMapping = {
        'business-review': 'Business Review',
        'product-demo': 'Product Demo',
        'contract-renewal': 'Contract Meeting',
        'sales-meeting': 'Sales Meeting',
        'support-visit': 'Support Visit'
      };
      typeEl.textContent = typeMapping[data.type] || data.title.includes('Review') ? 'Business Review' : 
                          data.title.includes('Demo') ? 'Product Demo' : 
                          data.title.includes('Contract') ? 'Contract Meeting' : 'Sales Meeting';
    }
    if (priorityEl) {
      priorityEl.textContent = data.priority;
      priorityEl.className = `visit-priority-badge ${data.priority}`;
    }
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `visit-status-badge ${data.status.replace('-', '')}`;
    }
    if (dateEl) dateEl.textContent = data.date;
    if (timeEl) timeEl.textContent = data.time;
    if (locationEl) locationEl.textContent = data.location;
    if (contactPersonEl) contactPersonEl.textContent = data.contactPerson;
    if (contactPhoneEl) contactPhoneEl.textContent = data.contactPhone || 'Not provided';
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (objectiveEl) objectiveEl.textContent = data.objective || data.description;
    if (descriptionEl) descriptionEl.textContent = data.description;
    
    if (agendaEl && data.agenda) {
      agendaEl.innerHTML = '';
      data.agenda.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        agendaEl.appendChild(li);
      });
    }
    
    if (materialsEl) materialsEl.textContent = data.materials || 'Not specified';
    if (travelModeEl) travelModeEl.textContent = data.travelMode || 'Not specified';
    if (travelTimeEl) travelTimeEl.textContent = data.travelTime || 'Not specified';
    if (expensesEl) expensesEl.textContent = data.expenses || '₹0';
    if (accommodationEl) accommodationEl.textContent = data.accommodation || 'Not Required';
    if (followUpDateEl) followUpDateEl.textContent = data.followUpDate || 'Not scheduled';
    if (followUpActionEl) followUpActionEl.textContent = data.followUpAction || 'No follow-up';
    
    document.querySelectorAll('#visitDetailScreen .status-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.status === data.status) {
        btn.classList.add('active');
      }
    });
    
    initVisitStatusButtons();
    updateEndVisitButtonVisibility();
  }

  // ========== UPLOAD FUNCTIONALITY ==========
  const leadUploadBtn = document.getElementById('leadUploadBtn');
  const leadFileInput = document.getElementById('leadFileInput');
  const leadUploadedFiles = document.getElementById('leadUploadedFiles');

  if (leadUploadBtn && leadFileInput) {
    leadUploadBtn.addEventListener('click', () => {
      leadFileInput.click();
    });

    leadFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, leadUploadedFiles);
      });
    });
  }

  const opportunityUploadBtn = document.getElementById('opportunityUploadBtn');
  const opportunityFileInput = document.getElementById('opportunityFileInput');
  const opportunityUploadedFiles = document.getElementById('opportunityUploadedFiles');

  if (opportunityUploadBtn && opportunityFileInput) {
    opportunityUploadBtn.addEventListener('click', () => {
      opportunityFileInput.click();
    });

    opportunityFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, opportunityUploadedFiles);
      });
    });
  }

  // ========== ADD TASK BUTTONS ==========
  const addTaskForLeadBtn = document.getElementById('addTaskForLeadBtn');
  const addTaskForOpportunityBtn = document.getElementById('addTaskForOpportunityBtn');

  if (addTaskForLeadBtn) {
    addTaskForLeadBtn.addEventListener('click', () => {
      showScreen('taskForm');
    });
  }

  if (addTaskForOpportunityBtn) {
    addTaskForOpportunityBtn.addEventListener('click', () => {
      showScreen('taskForm');
    });
  }

  // ========== INSIGHTS/IDEAS ==========
  function loadInsights() {
    const insightsContainer = document.getElementById('insightsList');
    if (!insightsContainer) return;
    
    insightsContainer.innerHTML = '';
    
    mockData.insights.forEach(insight => {
      const insightElement = document.createElement('div');
      insightElement.className = 'insight-card';
      
      let icon = '✨';
      let iconClass = 'insight-opportunity';
      
      switch(insight.type) {
        case 'opportunity':
          icon = '📈';
          iconClass = 'insight-opportunity';
          break;
        case 'action':
          icon = '🎯';
          iconClass = 'insight-action';
          break;
        case 'trend':
          icon = '📊';
          iconClass = 'insight-trend';
          break;
        case 'warning':
          icon = '⚠️';
          iconClass = 'insight-warning';
          break;
      }
      
      insightElement.innerHTML = `
        <div class="insight-icon ${iconClass}">
          ${icon}
        </div>
        <div class="insight-content">
          <div class="insight-header">
            <h4>${insight.title}</h4>
            <span class="insight-impact insight-impact-${insight.impact}">${insight.impact}</span>
          </div>
          <p>${insight.description}</p>
        </div>
      `;
      
      insightsContainer.appendChild(insightElement);
    });
  }

  const viewInsightsBtn = document.getElementById('viewInsightsBtn');
  if (viewInsightsBtn) {
    viewInsightsBtn.addEventListener('click', () => {
      loadInsights();
      showScreen('ideas');
    });
  }

  // ========== PLANNER ==========
  function loadPlannerEvents() {
    const eventsContainer = document.getElementById('plannerEvents');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '';
    
    if (mockData.plannerEvents && mockData.plannerEvents.length > 0) {
      mockData.plannerEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'planner-event';
        
        let icon = '📍';
        let iconClass = 'event-type-meeting';
        
        switch(event.type) {
          case 'call':
            icon = '📞';
            iconClass = 'event-type-call';
            break;
          case 'video':
            icon = '🎥';
            iconClass = 'event-type-video';
            break;
          case 'meeting':
            icon = '📍';
            iconClass = 'event-type-meeting';
            break;
          case 'task':
            icon = '✓';
            iconClass = 'event-type-task';
            break;
          case 'visit':
            icon = '📍';
            iconClass = 'event-type-meeting';
            break;
        }
        
        eventElement.innerHTML = `
          <div class="event-type ${iconClass}">
            ${icon}
          </div>
          <div class="event-content">
            <div class="event-header">
              <h4>${event.title}</h4>
              <span class="event-badge">${event.type}</span>
            </div>
            <div class="event-details">
              <span>⏰ ${event.time} (${event.duration})</span>
              ${event.attendees ? `<span>👥 ${event.attendees.join(', ')}</span>` : ''}
              ${event.location ? `<span>📍 ${event.location}</span>` : ''}
            </div>
          </div>
        `;
        
        eventsContainer.appendChild(eventElement);
      });
    } else {
      eventsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h4>No events scheduled</h4>
          <p>Tap the "+ Add Event" button to schedule your first event.</p>
        </div>
      `;
    }
  }

  // Calendar Navigation
  const todayBtn = document.getElementById('todayBtn');
  const prevWeekBtn = document.getElementById('prevWeekBtn');
  const nextWeekBtn = document.getElementById('nextWeekBtn');

  let currentDate = new Date();

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentDate = new Date();
      updateCalendar(currentDate);
    });
  }

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 7);
      updateCalendar(currentDate);
    });
  }

  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 7);
      updateCalendar(currentDate);
    });
  }

  function updateCalendar(date) {
    const dateElements = document.querySelectorAll('.calendar-date');
    const today = new Date();
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    dateElements.forEach((element, index) => {
      element.classList.remove('today', 'selected');
      
      const cellDate = new Date(startOfWeek);
      cellDate.setDate(startOfWeek.getDate() + index);
      
      const dayNumberEl = element.querySelector('.day-number');
      if (dayNumberEl) {
        dayNumberEl.textContent = cellDate.getDate();
      }
      
      const dayNameEl = element.querySelector('.day-name');
      if (dayNameEl) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNameEl.textContent = dayNames[cellDate.getDay()];
      }
      
      if (cellDate.toDateString() === today.toDateString()) {
        element.classList.add('today');
      }
      
      if (cellDate.toDateString() === date.toDateString()) {
        element.classList.add('selected');
      }
      
      element.onclick = () => {
        currentDate = new Date(cellDate);
        updateCalendar(currentDate);
      };
    });
  }

  // ========== VISITS FUNCTIONALITY ==========
  function loadVisitsData() {
    const visitsList = document.querySelector('#visitsScreen .leads-list');
    if (!visitsList) return;
    
    const existingVisits = visitsList.querySelectorAll('.visit-card');
    if (existingVisits.length > 3) {
      for (let i = 3; i < existingVisits.length; i++) {
        existingVisits[i].remove();
      }
    }
    
    Object.values(mockData.visits).forEach(visit => {
      const existingVisit = visitsList.querySelector(`.visit-card[data-visit-id="${visit.id}"]`);
      if (existingVisit) return;
      
      const visitCard = document.createElement('div');
      visitCard.className = 'visit-card';
      visitCard.setAttribute('data-visit-id', visit.id || '1');
      visitCard.setAttribute('data-status', visit.status);
      visitCard.setAttribute('data-priority', visit.priority);
      
      let iconClass = 'purple';
      if (visit.priority === 'high') iconClass = 'orange';
      if (visit.priority === 'medium') iconClass = 'blue';
      
      let statusClass = 'scheduled';
      if (visit.status === 'in-progress') statusClass = 'in-progress';
      if (visit.status === 'completed') statusClass = 'completed';
      
      visitCard.innerHTML = `
        <div class="visit-icon">
          <div class="icon-box ${iconClass}">📍</div>
        </div>
        <div class="visit-info">
          <div class="visit-header">
            <h4 class="visit-title">${visit.title}</h4>
            <div class="visit-badges">
              <span class="visit-priority-badge ${visit.priority}">${visit.priority}</span>
              <span class="visit-status-badge ${statusClass}">${visit.status}</span>
            </div>
          </div>
          <p class="visit-customer">${visit.customer}</p>
          <p class="visit-description">${visit.description}</p>
          <div class="visit-details">
            <span class="visit-time">⏰ ${visit.time} (${visit.duration})</span>
            <span class="visit-date">📅 ${visit.date}</span>
          </div>
          <div class="visit-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${visit.location}</span>
          </div>
        </div>
      `;
      
      visitsList.appendChild(visitCard);
    });
    
    document.querySelectorAll('#visitsScreen .visit-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (!e.target.closest('.icon-btn')) {
          const visitId = this.getAttribute('data-visit-id') || '1';
          loadVisitDetail(visitId);
          showScreen('visitDetail');
        }
      });
    });
  }

  // ========== SEARCH FUNCTIONALITY ==========
  const searchInputs = {
    main: document.getElementById('searchInput'),
    leads: document.getElementById('leadsSearch'),
    tasks: document.getElementById('tasksSearch'),
    opportunities: document.getElementById('opportunitiesSearch'),
    proposals: document.getElementById('proposalsSearch'),
    customers: document.getElementById('customersSearch'),
    complaints: document.getElementById('complaintsSearch'),
    ideas: document.getElementById('ideasSearch'),
    visits: document.getElementById('visitsSearch')
  };

  Object.entries(searchInputs).forEach(([key, input]) => {
    if (input) {
      input.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        performSearch(query, key);
      });
    }
  });

  function performSearch(query, context) {
    let selector = '';
    
    switch(context) {
      case 'leads':
        selector = '.lead-card';
        break;
      case 'tasks':
        selector = '.task-item';
        break;
      case 'opportunities':
        selector = '.opportunity-card';
        break;
      case 'proposals':
        selector = '.proposal-card';
        break;
      case 'customers':
        selector = '.customer-card';
        break;
      case 'complaints':
        selector = '.complaint-card';
        break;
      case 'ideas':
        selector = '.insight-card';
        break;
      case 'visits':
        selector = '.visit-card';
        break;
      default:
        return;
    }
    
    const items = document.querySelectorAll(selector);
    if (items.length === 0) return;
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  }

  // ========== FILTER FUNCTIONALITY ==========
  const filterButtons = {
    leads: document.getElementById('leadsFilterBtn'),
    tasks: document.getElementById('tasksFilterBtn'),
    opportunities: document.getElementById('opportunitiesFilterBtn'),
    proposals: document.getElementById('proposalsFilterBtn'),
    complaints: document.getElementById('complaintsFilterBtn'),
    visits: document.getElementById('visitsFilterBtn')
  };

  const filterPanels = {
    leads: document.getElementById('leadsFilterPanel'),
    tasks: document.getElementById('tasksFilterPanel'),
    opportunities: document.getElementById('opportunitiesFilterPanel'),
    proposals: document.getElementById('proposalsFilterPanel'),
    complaints: document.getElementById('complaintsFilterPanel'),
    visits: document.getElementById('visitsFilterPanel')
  };

  Object.entries(filterButtons).forEach(([key, button]) => {
    const panel = filterPanels[key];
    if (button && panel) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        Object.values(filterPanels).forEach(p => {
          if (p && p !== panel) p.classList.add('hidden');
        });
        
        panel.classList.toggle('hidden');
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-btn') && !e.target.closest('.filter-panel')) {
      Object.values(filterPanels).forEach(panel => {
        if (panel) panel.classList.add('hidden');
      });
    }
  });

  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      const filterGroup = this.closest('.filter-group');
      const allOptions = filterGroup.querySelectorAll('.filter-option');
      
      allOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      applyFilters();
    });
  });

  document.querySelectorAll('.clear-filters').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.closest('.filter-panel');
      if (panel) {
        panel.querySelectorAll('.filter-option').forEach(option => {
          if (option.dataset.value === 'all') {
            option.classList.add('active');
          } else {
            option.classList.remove('active');
          }
        });
        applyFilters();
      }
    });
  });

  function applyFilters() {
    const leadStatus = document.querySelector('#leadsFilterPanel [data-filter="status"].active')?.dataset.value;
    const taskPriority = document.querySelector('#tasksFilterPanel [data-filter="priority"].active')?.dataset.value;
    const oppStage = document.querySelector('#opportunitiesFilterPanel [data-filter="stage"].active')?.dataset.value;
    const propStatus = document.querySelector('#proposalsFilterPanel [data-filter="status"].active')?.dataset.value;
    const compPriority = document.querySelector('#complaintsFilterPanel [data-filter="priority"].active')?.dataset.value;
    const compStatus = document.querySelector('#complaintsFilterPanel [data-filter="status"].active')?.dataset.value;
    const visitStatus = document.querySelector('#visitsFilterPanel [data-filter="status"].active')?.dataset.value;
    const visitPriority = document.querySelector('#visitsFilterPanel [data-filter="priority"].active')?.dataset.value;

    if (leadStatus && leadStatus !== 'all') {
      document.querySelectorAll('.lead-card').forEach(card => {
        const cardStatus = card.dataset.status;
        card.style.display = cardStatus === leadStatus ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.lead-card').forEach(card => {
        card.style.display = '';
      });
    }

    if (taskPriority && taskPriority !== 'all') {
      document.querySelectorAll('.task-item').forEach(task => {
        const cardPriority = task.dataset.priority;
        task.style.display = cardPriority === taskPriority ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = '';
      });
    }

    if (oppStage && oppStage !== 'all') {
      document.querySelectorAll('.opportunity-card').forEach(card => {
        const cardStage = card.dataset.stage;
        card.style.display = cardStage === oppStage ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.opportunity-card').forEach(card => {
        card.style.display = '';
      });
    }

    if (propStatus && propStatus !== 'all') {
      document.querySelectorAll('.proposal-card').forEach(card => {
        const cardStatus = card.dataset.status;
        card.style.display = cardStatus === propStatus ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.proposal-card').forEach(card => {
        card.style.display = '';
      });
    }

    if ((compPriority && compPriority !== 'all') || (compStatus && compStatus !== 'all')) {
      document.querySelectorAll('.complaint-card').forEach(card => {
        const cardPriority = card.dataset.priority;
        const cardStatus = card.dataset.status;
        const priorityMatch = !compPriority || compPriority === 'all' || cardPriority === compPriority;
        const statusMatch = !compStatus || compStatus === 'all' || cardStatus === compStatus;
        card.style.display = priorityMatch && statusMatch ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.complaint-card').forEach(card => {
        card.style.display = '';
      });
    }

    if ((visitStatus && visitStatus !== 'all') || (visitPriority && visitPriority !== 'all')) {
      document.querySelectorAll('.visit-card').forEach(card => {
        const cardStatus = card.dataset.status;
        const cardPriority = card.dataset.priority;
        const statusMatch = !visitStatus || visitStatus === 'all' || cardStatus === visitStatus;
        const priorityMatch = !visitPriority || visitPriority === 'all' || cardPriority === visitPriority;
        card.style.display = statusMatch && priorityMatch ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.visit-card').forEach(card => {
        card.style.display = '';
      });
    }
  }

  // ========== CHAT FUNCTIONALITY ==========
  const fabBtn = document.getElementById('fabBtn');
  const chatModal = document.getElementById('chatModal');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (fabBtn && chatModal) {
    fabBtn.addEventListener('click', () => {
      chatModal.classList.remove('hidden');
    });
  }

  if (closeChatBtn && chatModal) {
    closeChatBtn.addEventListener('click', () => {
      chatModal.classList.add('hidden');
    });
  }

  function sendMessage() {
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (message) {
      addMessage('user', message);
      chatInput.value = '';
      
      setTimeout(() => {
        const responses = [
          "I understand. Let me check the lead status for you...",
          "Based on your sales data, I recommend following up with 3 leads today.",
          "I've scheduled a reminder for your important meeting tomorrow.",
          "Your sales target progress is at 90% - you're doing great!",
          "I can help you prepare a proposal. What information do you need?",
          "Looking at your opportunities, ABC Corp has an 80% chance of closing.",
          "You have 2 high-priority complaints that need attention today."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage('ai', randomResponse);
      }, 1000);
    }
  }

  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  function addMessage(sender, text) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${sender === 'ai' ? '🤖' : '👤'}</div>
      <div class="message-content">
        <p>${text}</p>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ========== TASK CHECKBOXES ==========
  document.querySelectorAll('.task-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskItem = this.closest('.task-item');
      if (this.checked) {
        taskItem.style.opacity = '0.7';
        const heading = taskItem.querySelector('h4');
        if (heading) heading.style.textDecoration = 'line-through';
      } else {
        taskItem.style.opacity = '1';
        const heading = taskItem.querySelector('h4');
        if (heading) heading.style.textDecoration = 'none';
      }
    });
  });

  // ========== TAB FUNCTIONALITY ==========
  document.querySelectorAll('.tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', function() {
      const tabContainer = this.closest('.detail-tabs');
      if (!tabContainer) return;
      
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      const tabId = this.getAttribute('data-tab') || this.textContent.toLowerCase();
      
      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id.includes(tabId)) {
          content.classList.add('active');
        }
      });
    });
  });

  // ========== EDIT BUTTONS ==========
  document.querySelectorAll('.edit-btn').forEach(editBtn => {
    editBtn.addEventListener('click', function() {
      alert('Edit functionality coming soon!');
    });
  });

  // ========== BOTTOM NAVIGATION ==========
  const navItems = {
    home: document.getElementById('navHome'),
    planner: document.getElementById('navPlanner'),
    ideas: document.getElementById('navIdeas'),
    settings: document.getElementById('navSettings')
  };

  if (navItems.home) {
    navItems.home.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.home.classList.add('active');
      showScreen('dashboard');
    });
  }

  if (navItems.planner) {
    navItems.planner.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.planner.classList.add('active');
      loadPlannerEvents();
      showScreen('planner');
    });
  }

  if (navItems.ideas) {
    navItems.ideas.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.ideas.classList.add('active');
      loadInsights();
      showScreen('ideas');
    });
  }

  if (navItems.settings) {
    navItems.settings.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.settings.classList.add('active');
      alert('Settings screen coming soon!');
    });
  }

  // ========== CREATE BUTTONS INSIDE SCREENS ==========
  const createOpportunityFab = document.getElementById('createOpportunityBtn');
  if (createOpportunityFab) {
    createOpportunityFab.addEventListener('click', () => {
      showScreen('opportunityForm');
    });
  }

  const createProposalFab = document.getElementById('createProposalBtn');
  if (createProposalFab) {
    createProposalFab.addEventListener('click', () => {
      alert('Create Proposal functionality coming soon!');
    });
  }

  const createComplaintFab = document.getElementById('createComplaintBtn');
  if (createComplaintFab) {
    createComplaintFab.addEventListener('click', () => {
      showScreen('complaintForm');
    });
  }

  const createCustomerFab = document.getElementById('createCustomerBtn');
  if (createCustomerFab) {
    createCustomerFab.addEventListener('click', () => {
      showScreen('customerForm');
    });
  }

  const scheduleVisitFab = document.getElementById('scheduleVisitFab');
  if (scheduleVisitFab) {
    scheduleVisitFab.addEventListener('click', () => {
      showScreen('visitForm');
    });
  }

  // ========== SIMPLIFIED SALES DASHBOARD CHARTS ==========
  function initializeSalesCharts() {
    console.log("Initializing simplified sales charts...");
    
    // Initialize Line Chart
    initializeLineChart();
    
    // Initialize Single Contribution Chart
    initializeContributionChart();
    
    // Initialize Funnel Details
    setupFunnelDetails();
  }

  function initializeLineChart() {
    const lineChartCanvas = document.getElementById('lineChartCanvas');
    if (!lineChartCanvas) return;
    
    const lineCtx = lineChartCanvas.getContext('2d');
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr'];
    const targetData = [10, 15, 20, 15];
    const achievedData = [8, 14, 18, 12];
    
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Target',
            data: targetData,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Achieved',
            data: achievedData,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return `₹${value}L`;
              }
            }
          }
        }
      }
    });
    
    console.log("Line chart initialized");
  }

  // Single chart for all contribution types
  let contributionChart = null;
  let currentChartType = 'region';

  function initializeContributionChart() {
    const chartCanvas = document.getElementById('contributionChart');
    if (!chartCanvas) {
      console.error("Contribution chart canvas not found!");
      return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    // Initial chart data (Region)
    const data = getChartData('region');
    
    contributionChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
    
    // Update legend
    updateChartLegend(data);
    
    // Setup chart switching
    setupChartSwitcher();
    
    console.log("Contribution chart initialized");
  }

  function getChartData(type) {
    const dataSets = {
      region: {
        labels: ['North', 'South', 'West', 'East'],
        data: [42, 28, 18, 12],
        colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#14b8a6'],
        labelsFull: ['North Region', 'South Region', 'West Region', 'East Region']
      },
      product: {
        labels: ['Software', 'Services', 'Hardware', 'Support'],
        data: [45, 30, 15, 10],
        colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#14b8a6'],
        labelsFull: ['Software Products', 'Services', 'Hardware', 'Support Services']
      },
      client: {
        labels: ['Enterprise', 'SMB', 'Startup'],
        data: [52, 38, 10],
        colors: ['#3b82f6', '#8b5cf6', '#f59e0b'],
        labelsFull: ['Enterprise Clients', 'Small & Medium Business', 'Startups']
      }
    };
    
    const dataset = dataSets[type] || dataSets.region;
    
    return {
      labels: dataset.labels,
      datasets: [{
        data: dataset.data,
        backgroundColor: dataset.colors,
        borderWidth: 0,
        borderRadius: 8
      }]
    };
  }

  function updateChartLegend(data) {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    
    const colors = data.datasets[0].backgroundColor;
    const labels = data.labels;
    
    let legendHTML = '';
    
    labels.forEach((label, index) => {
      const color = colors[index];
      const value = data.datasets[0].data[index];
      
      legendHTML += `
        <div class="legend-item">
          <span class="legend-color" style="background: ${color}"></span>
          <span class="legend-label">${label}</span>
          <span class="legend-value">${value}%</span>
        </div>
      `;
    });
    
    legendContainer.innerHTML = legendHTML;
  }

  function setupChartSwitcher() {
    // Dots navigation
    document.querySelectorAll('.carousel-dots .dot').forEach(dot => {
      dot.addEventListener('click', function() {
        const chartType = this.getAttribute('data-chart');
        switchChart(chartType);
        
        // Update active dot
        document.querySelectorAll('.carousel-dots .dot').forEach(d => {
          d.classList.remove('active');
        });
        this.classList.add('active');
        
        // Update dropdown
        const select = document.getElementById('contributionType');
        if (select) select.value = chartType;
      });
    });
    
    // Prev/Next buttons
    const prevBtn = document.getElementById('prevChartBtn');
    const nextBtn = document.getElementById('nextChartBtn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const types = ['region', 'product', 'client'];
        const currentIndex = types.indexOf(currentChartType);
        const prevIndex = (currentIndex - 1 + types.length) % types.length;
        switchChart(types[prevIndex]);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const types = ['region', 'product', 'client'];
        const currentIndex = types.indexOf(currentChartType);
        const nextIndex = (currentIndex + 1) % types.length;
        switchChart(types[nextIndex]);
      });
    }
    
    // Dropdown selector
    const select = document.getElementById('contributionType');
    if (select) {
      select.addEventListener('change', function() {
        switchChart(this.value);
      });
    }
  }

  function switchChart(type) {
    if (!contributionChart || currentChartType === type) return;
    
    const newData = getChartData(type);
    
    // Update chart data
    contributionChart.data.labels = newData.labels;
    contributionChart.data.datasets[0].data = newData.datasets[0].data;
    contributionChart.data.datasets[0].backgroundColor = newData.datasets[0].backgroundColor;
    
    // Update chart
    contributionChart.update();
    
    // Update legend
    updateChartLegend(newData);
    
    // Update current type
    currentChartType = type;
    
    // Update active dot
    document.querySelectorAll('.carousel-dots .dot').forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-chart') === type) {
        dot.classList.add('active');
      }
    });
    
    console.log(`Switched to ${type} chart`);
  }

  // ========== DEBUG FUNCTION ==========
  function debugChartSystem() {
    console.log("=== DEBUG: Chart System ===");
    
    // Check if we're on sales screen
    const salesScreen = document.getElementById('salesScreen');
    if (!salesScreen || !salesScreen.classList.contains('active')) {
      console.log("Not on sales screen. Current screen:", currentScreen);
      return;
    }
    
    // Check pie charts
    const pieCharts = document.querySelectorAll('.pie-chart');
    console.log(`Found ${pieCharts.length} pie charts on sales screen:`);
    
    pieCharts.forEach((chart, i) => {
      const canvas = chart.querySelector('canvas');
      const isActive = chart.classList.contains('active');
      console.log(`Chart ${i} (${chart.id}):`, {
        display: window.getComputedStyle(chart).display,
        active: isActive,
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 'no canvas'
      });
    });
    
    // Check select dropdown
    const select = document.getElementById('contributionType');
    console.log("Contribution select element:", {
      exists: !!select,
      value: select ? select.value : 'none',
      options: select ? Array.from(select.options).map(o => ({value: o.value, text: o.text})) : []
    });
    
    // Check carousel
    const dots = document.querySelectorAll('.carousel-dots .dot');
    console.log(`Carousel dots: ${dots.length} found`);
    
    dots.forEach((dot, i) => {
      console.log(`Dot ${i}:`, {
        active: dot.classList.contains('active'),
        index: dot.dataset.index
      });
    });
    
    // Check if Chart.js is loaded
    console.log("Chart.js loaded:", typeof Chart !== 'undefined');
    
    // Force show first chart if none are visible
    const visibleCharts = Array.from(pieCharts).filter(chart => 
      window.getComputedStyle(chart).display !== 'none'
    );
    
    if (visibleCharts.length === 0 && pieCharts.length > 0) {
      console.log("No charts visible, forcing first chart to show");
      pieCharts[0].style.display = 'block';
      pieCharts[0].classList.add('active');
    }
  }

  // ========== INITIALIZATION ==========
  if (navItems.home) {
    navItems.home.classList.add('active');
  }

  loadInsights();
  loadPlannerEvents();
  updateCalendar(new Date());
  updateNotificationCount();
  loadVisitsData();
  autoGenerateVisitDateTime();
  initVisitStatusButtons();
  autoFillComplaintContactInfo();

  if (chatMessages) {
    addMessage('ai', "Hi! I'm your SalesBuddy AI Assistant. How can I help you today?");
  }

  showScreen('dashboard');

  console.log('SalesBuddy fully loaded with Funnel Details Table!');
});
