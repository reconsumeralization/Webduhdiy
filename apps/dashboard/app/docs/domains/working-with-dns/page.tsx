import React from 'react';
import DocPage from '../../components/DocPage';

export default function WorkingWithDnsPage() {
  return (
    <DocPage
      title="Working with DNS"
      description="Learn about working with dns"
      breadcrumbs={[{ label: 'Domains', href: '/docs/domains' }]}
    />
  );
}
