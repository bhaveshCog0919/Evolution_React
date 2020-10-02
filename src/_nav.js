export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: '',
        text: '',
      },
    },
    {
      name: 'ClaimList',
      url: '/ClaimList',
      icon: 'icon-speedometer',
      badge: {
        variant: '',
        text: '',
      }
    },
    {
      name: 'ClaimsDetail',
      url: '/ClaimsDetail',
      icon: 'icon-speedometer',
      badge: {
        variant: '',
        text: '',
      }
    },
    {
      name: 'New Claim',
      url: '/NewClaim',
      icon: 'icon-speedometer',
      badge: {
        variant: '',
        text: '',
      }
    },
    {
      name: 'Contact Management',
      url: '/contactList',
      icon: 'fa fa-address-book',
      children: [
        /*{
          name: 'Contact List',
          url: '/contactList',
          icon: 'fa fa-search',
          badge: {
            variant: '',
            text: '',
          },
        },*/
        {
          name: 'Search Contact',
          url: '/SearchContact',
          icon: 'fa fa-search',
          badge: {
            variant: '',
            text: '',
          },
        }
      ],
      badge: {
        variant: '',
        text: '',
      }
    },
    {
      name: 'Notes',
      url: '/notes',
      icon: 'fa fa-clipboard',
      badge: {
        variant: '',
        text: '',
      }
    },
    {
      name: 'Policy',
      url: '/PolicyList',
      icon: 'fa fa-anchor',
      children: [
        {
          name: 'New Policy',
          url: '/NewPolicy',
          icon: 'fa fa-plus',
          badge: {
            variant: '',
            text: '',
          },
        },
        /*{
          name: 'Policy List',
          url: '/PolicyList',
          icon: 'fa fa-list-ol',
          badge: {
            variant: '',
            text: '',
          },
        },*/
        {
          name: 'Search Policy',
          url: '/SearchPolicy',
          icon: 'fa fa-search',
          badge: {
            variant: '',
            text: '',
          },
        },
      ]
    },
    {
      name: 'Reports',
      url: '/reports',
      icon: 'fa fa-bar-chart',
      children: [
        {
          name: 'Aged Debtors List',
          url: '/AgedDebtorsList',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        // {
        //   name: 'Agent Statement Batch',
        //   url: '/AgentBatch',
        //   icon: 'fa fa-area-chart',
        //   badge: {
        //     variant: '',
        //     text: '',
        //   },
        // },
        {
          name: 'Agent Commission Report',
          url: '/AgentCommissionReport',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },

        {
          name: 'Cashbook (In/Out)',
          url: '/cashbook',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          }
        },
        {
          name: 'Migration Report',
          url: '/MigrationReport',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          }
        },
        {
          name: 'Premium Bordereaux',
          url: '/bordereaux',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'ServiceCenter Statement',
          url: '/ServiceCenterStatement',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'SMS',
          url: '/SMSReport',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Email',
          url: '/EmailReport',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Sub Agent Statement',
          url: '/subagentstatement',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Sub Agent Payment Report',
          url: '/SubAgentPaymentReport',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Sub Agent Auto Statement Summary',
          url: '/SubAgentAutoStatementSummary',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Lead Quotation and newbusiness report',
          url: '/Lead_Quotation_and_newbusiness_report',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Renewal Not Sent Report',
          url: '/Renewal_Not_Sent_Report',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Renewal Follow up Report',
          url: '/Renewal_Follow_up_Report',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Renewal Forecasting Report',
          url: '/Renewal_Forecasting_Report',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Missing Contact Info Report',
          url: '/Contact_Missing_Report',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
      ]
    },
    {
      name: 'Master',
      url: '/admin',
      icon: 'fa fa-male',
      children: [
        {
          name: 'Vessel Class',
          url: '/Master/VesselClass',
          icon: 'fa fa-ship',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Vessel Type',
          url: '/Master/VesselType',
          icon: 'fa fa-shield',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Mooring Zone',
          url: '/Master/MooringZone',
          icon: 'fa fa-location-arrow',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Mooring Guide',
          url: '/Master/MooringGuide',
          icon: 'fa fa-map-pin',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Risk Question',
          url: '/Master/RiskQuestion',
          icon: 'fa fa-question',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Binder',
          url: '/Master/Binder',
          icon: 'icon-speech',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Assumption',
          url: '/Master/Assumption',
          icon: 'icon-speech',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Endorsement',
          url: '/Master/Endorsement',
          icon: 'icon-speech',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Levy',
          url: '/Master/Levy',
          icon: 'icon-speech',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'No Claim Bonus',
          url: '/Master/NoClaimBonus',
          icon: 'fa fa-money',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'StringMap',
          url: '/Master/StringMap',
          icon: 'icon-speech',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'System Config',
          url: '/Master/SysConfig',
          icon: 'icon-speech',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Documents',
          url: '/Master/DocumentMaster',
          icon: 'icon-speech',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
        name: 'Lead Management',
        url: '/Master/LeadManagement',
        icon: 'icon-speech',
        badge: {
          variant: '',
          text: '',
        },
      },
      ],
    },
    {
      name: 'Apps',
      url: '/apps',
      icon: 'icon-layers',
      children: [
        {
          name: 'Email',
          url: '/apps/email',
          icon: 'icon-speech',
          children: [
            {
              name: 'Inbox',
              url: '/apps/email/inbox',
              icon: 'icon-speech'
            },
            {
              name: 'Sent',
              url: '/apps/email/sent',
              icon: 'icon-speech'
            },
            {
              name: 'Compose',
              url: '/apps/email/compose',
              icon: 'icon-speech'
            },
          ],
        },
        {
          name: 'Bulk Renewals',
          url: '/BulkRenewals',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        },
        {
          name: 'Monitoring Report',
          url: '/MonitoringReport',
          icon: 'fa fa-area-chart',
          badge: {
            variant: '',
            text: '',
          },
        }
      ]
    }
  ],
};
