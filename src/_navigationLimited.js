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
      name: 'Contact Management',
      url: '/contactList',
      icon: 'fa fa-address-book',
      children: [
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
  ],
};
