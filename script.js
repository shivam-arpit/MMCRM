// script.js - UPDATED with proper form navigation

document.addEventListener("DOMContentLoaded", () => {
  console.log("SalesBuddy Application Initialized");

  // ========== SCREEN MANAGEMENT ==========
  const screens = {
    dashboard: document.getElementById('dashboardView'),
    sales: document.getElementById('salesScreen'),
    leads: document.getElementById('leadsScreen'),
    tasks: document.getElementById('tasksScreen'),
    leadDetail: document.getElementById('leadDetailScreen'),
    taskDetail: document.getElementById('taskDetailScreen'),
    leadForm: document.getElementById('leadFormScreen'),
    opportunityForm: document.getElementById('opportunityFormScreen'),
    ideas: document.getElementById('ideasScreen'),
    planner: document.getElementById('plannerScreen'),
    opportunities: document.getElementById('opportunitiesScreen'),
    opportunityDetail: document.getElementById('opportunityDetailScreen'),
    proposals: document.getElementById('proposalsScreen'),
    proposalDetail: document.getElementById('proposalDetailScreen'),
    customers: document.getElementById('customersScreen'),
    customerDetail: document.getElementById('customerDetailScreen'),
    complaints: document.getElementById('complaintsScreen'),
    complaintDetail: document.getElementById('complaintDetailScreen')
  };

  let currentScreen = 'dashboard';
  let screenHistory = [];

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
        // Scroll to top when changing screens
        screen.scrollTop = 0;
      }, 10);
      
      // Update history
      screenHistory.push(screenId);
      currentScreen = screenId;
      
      // Load data for specific screens
      if (screenId === 'ideas') {
        loadInsights();
      } else if (screenId === 'planner') {
        loadPlannerEvents();
        updateCalendar(new Date());
      }
    }
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      screenHistory.pop(); // Remove current
      const prevScreen = screenHistory.pop();
      if (prevScreen && screens[prevScreen]) {
        showScreen(prevScreen);
      } else {
        showScreen('dashboard');
      }
    } else {
      showScreen('dashboard');
    }
  };

  // ========== DASHBOARD CARD NAVIGATION ==========
  // Sales Target Card
  const salesTargetCard = document.getElementById('salesTargetCard');
  if (salesTargetCard) {
    salesTargetCard.addEventListener('click', () => {
      showScreen('sales');
    });
  }

  // Leads Card - Go to Leads screen (NOT Lead Form)
  const leadsCard = document.getElementById('leadsCard');
  if (leadsCard) {
    leadsCard.addEventListener('click', () => {
      showScreen('leads');
    });
  }

  // Tasks Card
  const tasksCard = document.getElementById('tasksCard');
  if (tasksCard) {
    tasksCard.addEventListener('click', () => {
      showScreen('tasks');
    });
  }

  // Opportunities Card - Go to Opportunities screen (NOT Opportunity Form)
  const opportunitiesCard = document.getElementById('opportunitiesCard');
  if (opportunitiesCard) {
    opportunitiesCard.addEventListener('click', () => {
      showScreen('opportunities');
    });
  }

  // Proposals Card
  const proposalsCard = document.getElementById('proposalsCard');
  if (proposalsCard) {
    proposalsCard.addEventListener('click', () => {
      showScreen('proposals');
    });
  }

  // Customers Card
  const customersCard = document.getElementById('customersCard');
  if (customersCard) {
    customersCard.addEventListener('click', () => {
      showScreen('customers');
    });
  }

  // Complaints Card
  const complaintsCard = document.getElementById('complaintsCard');
  if (complaintsCard) {
    complaintsCard.addEventListener('click', () => {
      showScreen('complaints');
    });
  }

  // New Lead Form Card - Goes to Lead Form
  const newLeadFormCard = document.getElementById('newLeadFormCard');
  if (newLeadFormCard) {
    newLeadFormCard.addEventListener('click', () => {
      showScreen('leadForm');
    });
  }

  // New Opportunity Form Card - Goes to Opportunity Form
  const newOpportunityFormCard = document.getElementById('newOpportunityFormCard');
  if (newOpportunityFormCard) {
    newOpportunityFormCard.addEventListener('click', () => {
      showScreen('opportunityForm');
    });
  }

  // ========== BACK BUTTONS ==========
  // Add all back button event listeners...
  const backButtons = {
    sales: document.getElementById('backFromSales'),
    leads: document.getElementById('backFromLeads'),
    tasks: document.getElementById('backFromTasks'),
    leadDetail: document.getElementById('backFromLeadDetail'),
    taskDetail: document.getElementById('backFromTaskDetail'),
    leadForm: document.getElementById('backFromLeadForm'),
    opportunityForm: document.getElementById('backFromOpportunityForm'),
    ideas: document.getElementById('backFromIdeas'),
    planner: document.getElementById('backFromPlanner'),
    opportunities: document.getElementById('backFromOpportunities'),
    opportunityDetail: document.getElementById('backFromOpportunityDetail'),
    proposals: document.getElementById('backFromProposals'),
    proposalDetail: document.getElementById('backFromProposalDetail'),
    customers: document.getElementById('backFromCustomers'),
    customerDetail: document.getElementById('backFromCustomerDetail'),
    complaints: document.getElementById('backFromComplaints'),
    complaintDetail: document.getElementById('backFromComplaintDetail')
  };

  Object.values(backButtons).forEach(button => {
    if (button) {
      button.addEventListener('click', goBack);
    }
  });

  // ========== CREATE BUTTONS INSIDE SCREENS ==========
  // In Leads Screen - Add a Create Lead button
  const leadsScreen = document.getElementById('leadsScreen');
  if (leadsScreen) {
    // Create a Create Lead button for Leads screen header
    const createLeadInLeadsBtn = document.createElement('button');
    createLeadInLeadsBtn.innerHTML = '<i class="fas fa-plus"></i>';
    createLeadInLeadsBtn.className = 'edit-btn';
    createLeadInLeadsBtn.style.marginLeft = 'auto';
    createLeadInLeadsBtn.title = 'Create New Lead';
    
    // Find the leads header and add the button
    const leadsHeader = leadsScreen.querySelector('.sub-header');
    if (leadsHeader) {
      // Check if button already exists
      const existingBtn = leadsHeader.querySelector('.create-lead-btn');
      if (!existingBtn) {
        createLeadInLeadsBtn.classList.add('create-lead-btn');
        leadsHeader.appendChild(createLeadInLeadsBtn);
        
        createLeadInLeadsBtn.addEventListener('click', () => {
          showScreen('leadForm');
        });
      }
    }
  }

  // In Opportunities Screen - Add a Create Opportunity button
  const opportunitiesScreen = document.getElementById('opportunitiesScreen');
  if (opportunitiesScreen) {
    // Create a Create Opportunity button for Opportunities screen header
    const createOppInOppsBtn = document.createElement('button');
    createOppInOppsBtn.innerHTML = '<i class="fas fa-plus"></i>';
    createOppInOppsBtn.className = 'edit-btn';
    createOppInOppsBtn.style.marginLeft = 'auto';
    createOppInOppsBtn.title = 'Create New Opportunity';
    
    // Find the opportunities header and add the button
    const oppsHeader = opportunitiesScreen.querySelector('.sub-header');
    if (oppsHeader) {
      // Check if button already exists
      const existingBtn = oppsHeader.querySelector('.create-opp-btn');
      if (!existingBtn) {
        createOppInOppsBtn.classList.add('create-opp-btn');
        oppsHeader.appendChild(createOppInOppsBtn);
        
        createOppInOppsBtn.addEventListener('click', () => {
          showScreen('opportunityForm');
        });
      }
    }
  }

  // ========== FAB CREATE BUTTONS ==========
  // These are the floating buttons at bottom right of list screens
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
      alert('Create Complaint functionality coming soon!');
    });
  }

  const createCustomerFab = document.getElementById('createCustomerBtn');
  if (createCustomerFab) {
    createCustomerFab.addEventListener('click', () => {
      alert('Create Customer functionality coming soon!');
    });
  }

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

  // ========== MOCK DATA ==========
  const mockData = {
    leads: {
      '1': {
        name: 'John Smith',
        company: 'Tech Innovations Inc',
        status: 'Hot',
        value: '₹5.2L',
        region: 'North India',
        industry: 'Technology',
        assignedTo: 'Rahul Kumar',
        lastContact: '2024-03-15',
        tags: ['Enterprise', 'Q1 Priority', 'Decision Maker'],
        initials: 'JS'
      },
      '2': {
        name: 'Sarah Johnson',
        company: 'Digital Solutions',
        status: 'Warm',
        value: '₹3.8L',
        region: 'West India',
        industry: 'Digital Services',
        assignedTo: 'Priya Sharma',
        lastContact: '2024-03-14',
        tags: ['SMB', 'Marketing'],
        initials: 'SJ'
      }
    },
    tasks: {
      '1': {
        title: 'Follow up with ABC Corp',
        description: 'Call John Smith to discuss the enterprise license proposal. Make sure to address their concerns about pricing and implementation timeline.',
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
        description: 'Full enterprise license for 500 users including premium support and training.'
      },
      '2': {
        title: 'Cloud Migration Project',
        company: 'XYZ Ltd',
        stage: 'Proposal',
        value: '₹8.3L',
        probability: 60,
        expectedClose: '2024-04-30',
        owner: 'Priya Sharma',
        description: 'Complete cloud migration and infrastructure setup.'
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
    insights: [
      {
        id: 1,
        type: "opportunity",
        title: "Upsell Opportunity Detected",
        description: "ABC Corp's usage has increased 40%. Consider proposing premium tier upgrade.",
        impact: "high"
      },
      {
        id: 2,
        type: "action",
        title: "Follow-up Recommended",
        description: "3 leads haven't been contacted in 7 days. Schedule follow-up calls.",
        impact: "high"
      },
      {
        id: 3,
        type: "trend",
        title: "Sales Trend Alert",
        description: "Q1 sales up by 25% compared to last year. Great work!",
        impact: "medium"
      },
      {
        id: 4,
        type: "warning",
        title: "Customer Satisfaction Drop",
        description: "Customer satisfaction decreased by 10% this month. Review recent complaints.",
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
      },
      {
        id: 2,
        title: "Product Demo - XYZ Ltd",
        type: "video",
        time: "10:30 AM",
        duration: "1 hour",
        attendees: ["Sarah Johnson", "Mike Chen"]
      },
      {
        id: 3,
        title: "Team Meeting",
        type: "meeting",
        time: "02:00 PM",
        duration: "1 hour",
        attendees: ["Sales Team"]
      }
    ]
  };

  // ========== DETAIL PAGE LOADERS ==========
  function loadLeadDetail(leadId) {
    const data = mockData.leads[leadId] || mockData.leads['1'];
    
    // Update UI elements
    const nameEl = document.getElementById('leadDetailName');
    const companyEl = document.getElementById('leadDetailCompany');
    const statusEl = document.getElementById('leadDetailStatus');
    const valueEl = document.getElementById('leadDetailValue');
    const regionEl = document.getElementById('leadDetailRegion');
    const industryEl = document.getElementById('leadDetailIndustry');
    const assignedEl = document.getElementById('leadDetailAssignedTo');
    const contactEl = document.getElementById('leadDetailLastContact');
    const avatarEl = document.getElementById('leadDetailAvatar');
    const tagsEl = document.getElementById('leadDetailTags');
    
    if (nameEl) nameEl.textContent = data.name;
    if (companyEl) companyEl.textContent = data.company;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `lead-badge ${data.status.toLowerCase()}`;
    }
    if (valueEl) valueEl.textContent = data.value;
    if (regionEl) regionEl.textContent = data.region;
    if (industryEl) industryEl.textContent = data.industry;
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (contactEl) contactEl.textContent = data.lastContact;
    if (avatarEl) avatarEl.textContent = data.initials;
    
    // Update tags
    if (tagsEl && data.tags) {
      tagsEl.innerHTML = '';
      data.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsEl.appendChild(tagElement);
      });
    }
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

  function loadOpportunityDetail(opportunityId) {
    const data = mockData.opportunities[opportunityId] || mockData.opportunities['1'];
    
    const titleEl = document.getElementById('opportunityDetailTitle');
    const companyEl = document.getElementById('opportunityDetailCompany');
    const stageEl = document.getElementById('opportunityDetailStage');
    const valueEl = document.getElementById('opportunityDetailValue');
    const probEl = document.getElementById('opportunityDetailProbability');
    const closeEl = document.getElementById('opportunityDetailExpectedClose');
    const ownerEl = document.getElementById('opportunityDetailOwner');
    const descEl = document.getElementById('opportunityDetailDescription');
    const progressEl = document.getElementById('opportunityProgressBar');
    
    if (titleEl) titleEl.textContent = data.title;
    if (companyEl) companyEl.textContent = data.company;
    if (stageEl) {
      stageEl.textContent = data.stage;
      stageEl.className = `opportunity-badge ${data.stage.toLowerCase().replace(' ', '-')}`;
    }
    if (valueEl) valueEl.textContent = data.value;
    if (probEl) {
      probEl.textContent = `${data.probability}%`;
    }
    if (closeEl) closeEl.textContent = data.expectedClose;
    if (ownerEl) ownerEl.textContent = data.owner;
    if (descEl) descEl.textContent = data.description;
    if (progressEl) {
      progressEl.style.width = `${data.probability}%`;
    }
  }

  function loadProposalDetail(proposalId) {
    const data = mockData.proposals[proposalId] || mockData.proposals['1'];
    
    const titleEl = document.getElementById('proposalDetailTitle');
    const companyEl = document.getElementById('proposalDetailCompany');
    const statusEl = document.getElementById('proposalDetailStatus');
    const valueEl = document.getElementById('proposalDetailValue');
    const validEl = document.getElementById('proposalDetailValidUntil');
    const ownerEl = document.getElementById('proposalDetailOwner');
    const descEl = document.getElementById('proposalDetailDescription');
    
    if (titleEl) titleEl.textContent = data.title;
    if (companyEl) companyEl.textContent = data.company;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `proposal-badge ${data.status}`;
    }
    if (valueEl) valueEl.textContent = data.value;
    if (validEl) validEl.textContent = data.validUntil;
    if (ownerEl) ownerEl.textContent = data.owner;
    if (descEl) descEl.textContent = data.description;
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

  // ========== FORM HANDLING ==========
  // Lead Form Submission
  const leadForm = document.getElementById('salesbuddyLeadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('sbLeadName').value,
        description: document.getElementById('sbLeadDescription').value,
        mmProducts: document.getElementById('sbMmProducts').value,
        tag: document.getElementById('sbLeadTag').value,
        assignTo: document.getElementById('sbAssignTo').value,
        client: document.getElementById('sbClient').value,
        clientProduct: document.getElementById('sbClientProduct').value,
        brand: document.getElementById('sbBrand').value,
        industry: document.getElementById('sbIndustry').value,
        organization: document.getElementById('sbOrganizationAgency').value,
        primaryContact: document.querySelector('input[name="sbPrimaryContact"]:checked')?.value,
        orgContact: document.getElementById('sbOrgAgencyContact').value,
        clientContact: document.getElementById('sbClientContact').value,
        rollingMonth: document.getElementById('sbRollingMonth').value,
        source: document.getElementById('sbSource').value,
        mmDivision: document.getElementById('sbMmDivision').value,
        subDivision: document.getElementById('sbSubDivision').value,
        region: document.getElementById('sbRegion').value,
        status: document.getElementById('sbLeadStatus').value,
        notification: document.getElementById('sbSendNotification').value,
        location: document.getElementById('sbLeadCoords').value
      };
      
      console.log('Lead Form Submitted:', formData);
      
      // Create a new lead object
      const newLeadId = Object.keys(mockData.leads).length + 1;
      const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      
      mockData.leads[newLeadId] = {
        name: formData.name,
        company: formData.client || 'Unknown Company',
        status: formData.status || 'New',
        value: '₹0',
        region: formData.region || 'Unknown',
        industry: formData.industry || 'Unknown',
        assignedTo: formData.assignTo || 'Unassigned',
        lastContact: new Date().toISOString().split('T')[0],
        tags: formData.tag ? [formData.tag] : [],
        initials: initials || 'NA'
      };
      
      alert('Lead created successfully!');
      showScreen('leads');
      
      // Reset form
      this.reset();
    });
  }

  // Opportunity Form Submission
  const opportunityForm = document.getElementById('salesbuddyOpportunityForm');
  if (opportunityForm) {
    opportunityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('sbOpportunityName').value,
        relatedLead: document.getElementById('sbRelatedLead').value,
        expectedValue: document.getElementById('sbExpectedValue').value,
        probability: document.getElementById('sbProbability').value,
        stage: document.getElementById('sbOpportunityStage').value,
        closeDate: document.getElementById('sbCloseDate').value,
        description: document.getElementById('sbOpportunityDescription').value,
        products: document.getElementById('sbOpportunityProducts').value,
        competitors: document.getElementById('sbCompetitors').value,
        nextSteps: document.getElementById('sbNextSteps').value,
        client: document.getElementById('sbOpportunityClient').value,
        brand: document.getElementById('sbOpportunityBrand').value,
        industry: document.getElementById('sbOpportunityIndustry').value,
        source: document.getElementById('sbOpportunitySource').value,
        assignTo: document.getElementById('sbOpportunityAssignTo').value,
        location: document.getElementById('sbOpportunityCoords').value
      };
      
      console.log('Opportunity Form Submitted:', formData);
      
      // Create a new opportunity object
      const newOppId = Object.keys(mockData.opportunities).length + 1;
      const value = formData.expectedValue ? `₹${parseFloat(formData.expectedValue).toFixed(1)}L` : '₹0';
      
      mockData.opportunities[newOppId] = {
        title: formData.name,
        company: formData.client || 'Unknown Company',
        stage: formData.stage || 'Qualification',
        value: value,
        probability: parseInt(formData.probability) || 10,
        expectedClose: formData.closeDate || new Date().toISOString().split('T')[0],
        owner: formData.assignTo || 'Unassigned',
        description: formData.description || 'No description provided.'
      };
      
      alert('Opportunity created successfully!');
      showScreen('opportunities');
      
      // Reset form
      this.reset();
    });
  }

  // ========== FORM VOICE RECORDER ==========
  // Lead Form Voice Recorder
  const startRecordBtn = document.getElementById('sbStartRecord');
  const recordingState = document.getElementById('sbRecordingState');
  const readyState = document.getElementById('sbReadyState');
  const playbackState = document.getElementById('sbPlaybackState');
  const cancelRecordBtn = document.getElementById('sbCancelRecord');
  const sendRecordBtn = document.getElementById('sbSendRecord');
  const deleteRecordingBtn = document.getElementById('sbDeleteRecording');
  const recordingTimer = document.getElementById('sbRecordingTimer');
  const audioPlayback = document.getElementById('sbAudioPlayback');

  if (startRecordBtn) {
    let recordingInterval;
    let seconds = 0;
    
    startRecordBtn.addEventListener('click', () => {
      // Show recording state
      readyState.style.display = 'none';
      recordingState.style.display = 'block';
      
      // Start timer
      seconds = 0;
      updateTimer();
      recordingInterval = setInterval(() => {
        seconds++;
        updateTimer();
      }, 1000);
    });
    
    function updateTimer() {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (recordingTimer) {
        recordingTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
    
    if (cancelRecordBtn) {
      cancelRecordBtn.addEventListener('click', () => {
        clearInterval(recordingInterval);
        recordingState.style.display = 'none';
        readyState.style.display = 'block';
      });
    }
    
    if (sendRecordBtn) {
      sendRecordBtn.addEventListener('click', () => {
        clearInterval(recordingInterval);
        recordingState.style.display = 'none';
        playbackState.style.display = 'block';
        
        // Simulate audio playback
        if (audioPlayback) {
          audioPlayback.src = '#';
        }
      });
    }
    
    if (deleteRecordingBtn) {
      deleteRecordingBtn.addEventListener('click', () => {
        playbackState.style.display = 'none';
        readyState.style.display = 'block';
        if (audioPlayback) {
          audioPlayback.src = '';
        }
      });
    }
  }

  // ========== FORM LOCATION BUTTONS ==========
  // Lead Form Location Button
  const leadMapBtn = document.getElementById('sbLeadMapBtn');
  if (leadMapBtn) {
    leadMapBtn.addEventListener('click', () => {
      const statusEl = document.getElementById('sbLeadLocationStatus');
      const coordsEl = document.getElementById('sbLeadCoords');
      
      if (navigator.geolocation) {
        statusEl.textContent = 'Getting location...';
        statusEl.style.color = '#f59e0b';
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            coordsEl.value = `${lat}, ${lng}`;
            statusEl.textContent = 'Location captured successfully!';
            statusEl.style.color = '#22c55e';
          },
          (error) => {
            console.error('Geolocation error:', error);
            statusEl.textContent = 'Unable to get location. Please enter manually.';
            statusEl.style.color = '#ef4444';
            
            // Fallback to default coordinates
            coordsEl.value = '28.6139, 77.2090'; // Delhi coordinates
          }
        );
      } else {
        statusEl.textContent = 'Geolocation not supported by browser';
        statusEl.style.color = '#ef4444';
        coordsEl.value = '28.6139, 77.2090'; // Default coordinates
      }
    });
  }

  // Opportunity Form Location Button
  const opportunityMapBtn = document.getElementById('sbOpportunityMapBtn');
  if (opportunityMapBtn) {
    opportunityMapBtn.addEventListener('click', () => {
      const statusEl = document.getElementById('sbOpportunityLocationStatus');
      const coordsEl = document.getElementById('sbOpportunityCoords');
      
      if (navigator.geolocation) {
        statusEl.textContent = 'Getting location...';
        statusEl.style.color = '#f59e0b';
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            coordsEl.value = `${lat}, ${lng}`;
            statusEl.textContent = 'Location captured successfully!';
            statusEl.style.color = '#22c55e';
          },
          (error) => {
            console.error('Geolocation error:', error);
            statusEl.textContent = 'Unable to get location. Please enter manually.';
            statusEl.style.color = '#ef4444';
            
            // Fallback to default coordinates
            coordsEl.value = '28.6139, 77.2090'; // Delhi coordinates
          }
        );
      } else {
        statusEl.textContent = 'Geolocation not supported by browser';
        statusEl.style.color = '#ef4444';
        coordsEl.value = '28.6139, 77.2090'; // Default coordinates
      }
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

  // View Insights Button
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
          </div>
        </div>
      `;
      
      eventsContainer.appendChild(eventElement);
    });
  }

  // Calendar Navigation
  const todayBtn = document.getElementById('todayBtn');
  const prevWeekBtn = document.getElementById('prevWeekBtn');
  const nextWeekBtn = document.getElementById('nextWeekBtn');

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      updateCalendar(new Date());
    });
  }

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      alert('Previous week navigation');
    });
  }

  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      alert('Next week navigation');
    });
  }

  function updateCalendar(date) {
    const dateElements = document.querySelectorAll('.calendar-date');
    dateElements.forEach((element, index) => {
      element.classList.remove('today', 'selected');
      
      // Mock: Tuesday is selected, Sunday is today
      if (index === 2) {
        element.classList.add('selected');
      }
      if (index === 0) {
        element.classList.add('today');
      }
    });
  }

  // Add Event Button
  const addEventBtn = document.getElementById('addEventBtn');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      alert('Add event functionality coming soon!');
    });
  }

  // ========== NOTIFICATIONS ==========
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');

  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notification') && !e.target.closest('.notification-dropdown')) {
        notificationDropdown.classList.add('hidden');
      }
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
    ideas: document.getElementById('ideasSearch')
  };

  // Add search functionality
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
      default:
        return;
    }
    
    document.querySelectorAll(selector).forEach(item => {
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
    complaints: document.getElementById('complaintsFilterBtn')
  };

  const filterPanels = {
    leads: document.getElementById('leadsFilterPanel'),
    tasks: document.getElementById('tasksFilterPanel'),
    opportunities: document.getElementById('opportunitiesFilterPanel'),
    proposals: document.getElementById('proposalsFilterPanel'),
    complaints: document.getElementById('complaintsFilterPanel')
  };

  // Toggle filter panels
  Object.entries(filterButtons).forEach(([key, button]) => {
    const panel = filterPanels[key];
    if (button && panel) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other panels
        Object.values(filterPanels).forEach(p => {
          if (p && p !== panel) p.classList.add('hidden');
        });
        
        // Toggle current panel
        panel.classList.toggle('hidden');
      });
    }
  });

  // Close panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-btn') && !e.target.closest('.filter-panel')) {
      Object.values(filterPanels).forEach(panel => {
        if (panel) panel.classList.add('hidden');
      });
    }
  });

  // Filter options
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      const filterGroup = this.closest('.filter-group');
      const allOptions = filterGroup.querySelectorAll('.filter-option');
      
      allOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      applyFilters();
    });
  });

  // Clear filters
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
    // Get active filters
    const leadStatus = document.querySelector('#leadsFilterPanel [data-filter="status"].active')?.dataset.value;
    const taskPriority = document.querySelector('#tasksFilterPanel [data-filter="priority"].active')?.dataset.value;
    const oppStage = document.querySelector('#opportunitiesFilterPanel [data-filter="stage"].active')?.dataset.value;
    const propStatus = document.querySelector('#proposalsFilterPanel [data-filter="status"].active')?.dataset.value;
    const compPriority = document.querySelector('#complaintsFilterPanel [data-filter="priority"].active')?.dataset.value;
    const compStatus = document.querySelector('#complaintsFilterPanel [data-filter="status"].active')?.dataset.value;

    // Apply lead filters
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

    // Apply task filters
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

    // Apply opportunity filters
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

    // Apply proposal filters
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

    // Apply complaint filters
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
  }

  // ========== CHAT FUNCTIONALITY ==========
  const fabBtn = document.getElementById('fabBtn');
  const chatModal = document.getElementById('chatModal');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // Open chat
  if (fabBtn && chatModal) {
    fabBtn.addEventListener('click', () => {
      chatModal.classList.remove('hidden');
    });
  }

  // Close chat
  if (closeChatBtn && chatModal) {
    closeChatBtn.addEventListener('click', () => {
      chatModal.classList.add('hidden');
    });
  }

  // Send message
  function sendMessage() {
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (message) {
      // Add user message
      addMessage('user', message);
      chatInput.value = '';
      
      // Simulate AI response
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

  // Send button
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }

  // Enter key
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
        taskItem.querySelector('h4').style.textDecoration = 'line-through';
      } else {
        taskItem.style.opacity = '1';
        taskItem.querySelector('h4').style.textDecoration = 'none';
      }
    });
  });

  // ========== TAB FUNCTIONALITY ==========
  document.querySelectorAll('.tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', function() {
      const tabContainer = this.closest('.detail-tabs');
      
      // Update active tab button
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Get tab id
      const tabId = this.getAttribute('data-tab') || this.textContent.toLowerCase();
      
      // Show corresponding tab content
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

  // Home nav
  if (navItems.home) {
    navItems.home.addEventListener('click', () => {
      // Remove active from all
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      // Add active to home
      navItems.home.classList.add('active');
      showScreen('dashboard');
    });
  }

  // Planner nav
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

  // Ideas nav
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

  // Settings nav
  if (navItems.settings) {
    navItems.settings.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.settings.classList.add('active');
      alert('Settings screen coming soon!');
    });
  }

  // ========== INITIALIZATION ==========
  // Set initial active nav
  if (navItems.home) {
    navItems.home.classList.add('active');
  }

  // Load initial data
  loadInsights();
  loadPlannerEvents();
  updateCalendar(new Date());

  // Add welcome message to chat
  if (chatMessages) {
    addMessage('ai', "Hi! I'm your SalesBuddy AI Assistant. How can I help you today?");
  }

  // Show dashboard initially
  showScreen('dashboard');

  console.log('SalesBuddy fully loaded with form handling!');
});