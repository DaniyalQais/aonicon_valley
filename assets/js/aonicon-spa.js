/**
 * Aonicon Digital & AI Agency - Single Page Application (SPA) Engine
 * Handles smooth scrolling, offset calculation, scrollspy nav highlighting,
 * capabilities tab switching, interactive scope estimator, case study modal,
 * and seamless contact form submission.
 */

(function ($) {
  'use strict';

  // Case Study Details Matrix for SPA Modal
  const CASE_STUDIES = {
    '1': {
      title: 'FinTech Cloud Dashboard & Core Engine',
      category: 'Web App & React / Node.js',
      client: 'Apex Financial Technologies',
      challenge: 'High-frequency transaction monitoring dashboard suffered from slow query latencies (4.2s) and unintuitive user flows, causing high churn during enterprise trials.',
      solution: 'Re-architected client application in Next.js 14 and React Server Components with real-time WebSocket pipelines and optimized Redis caching.',
      results: [
        { value: '78ms', label: 'Average Query Latency' },
        { value: '+310%', label: 'Trial-to-Paid Conversion' },
        { value: '99.99%', label: 'Verified Uptime' }
      ]
    },
    '2': {
      title: 'Cross-Platform Telehealth & Patient App',
      category: 'Mobile App / Flutter & HIPAA Cloud',
      client: 'CarePulse Health Solutions',
      challenge: 'Existing legacy native iOS and Android apps had divergent codebases, slow release cycles, and intermittent video consultation dropped frames.',
      solution: 'Unified into a single high-performance Flutter codebase with WebRTC video calling, biometric auth, and end-to-end encrypted HIPAA compliance.',
      results: [
        { value: '4.9★', label: 'App Store Rating (14k reviews)' },
        { value: '-60%', label: 'Feature Development Time' },
        { value: '1.2M+', label: 'Active Monthly Patients' }
      ]
    },
    '3': {
      title: 'Global E-Commerce Omnichannel Growth & PPC',
      category: 'Google Ads PPC & SEO Scaling',
      client: 'Veloce Luxury Apparel',
      challenge: 'Rising CAC (Customer Acquisition Cost) on generic channels and low ROAS (1.8x) constrained brand scaling across European and US markets.',
      solution: 'Deployed granular Performance Max campaigns, first-party cookie tracking infrastructure, programmatic SEO landing pages, and automated bidding algorithms.',
      results: [
        { value: '5.8x', label: 'Target ROAS Achieved' },
        { value: '+240%', label: 'Organic Search Revenue' },
        { value: '-42%', label: 'Blended Acquisition Cost' }
      ]
    },
    '4': {
      title: 'Autonomous AI Customer Support & RAG Agent',
      category: 'Custom AI & LLM Engineering',
      client: 'Nexus SaaS Logistics',
      challenge: 'Customer support queues experienced 18-hour response delays on technical API integrations, overloading tier-2 engineers.',
      solution: 'Built an enterprise RAG (Retrieval-Augmented Generation) agent using LangChain, pgvector, and Claude 3.5 Sonnet to autonomously diagnose and resolve 72% of tier-1 and tier-2 tickets.',
      results: [
        { value: '72%', label: 'Autonomous Resolution Rate' },
        { value: '< 15s', label: 'Average Response Time' },
        { value: '$320k', label: 'Annual Support Savings' }
      ]
    },
    '5': {
      title: 'Global Logistics Cloud & Telematics IoT',
      category: 'Cloud Microservices & Real-Time IoT',
      client: 'Nexus Global TransLogistics',
      challenge: 'Global supply chain fleet across 28 countries suffered from fragmented telemetry data, delayed ETA updates, and high fuel inefficiency.',
      solution: 'Architected distributed Go microservices and Apache Kafka streaming engine ingesting 50,000 telemetry pings per second with real-time ETA recalculation.',
      results: [
        { value: '45k+', label: 'Connected Fleet Vehicles' },
        { value: '-38%', label: 'Fuel Waste Reduced' },
        { value: '99.98%', label: 'Real-Time Streaming Uptime' }
      ]
    },
    '6': {
      title: 'Enterprise Cloud Architecture & Zero-Trust',
      category: 'Enterprise SecOps & Cloud Infrastructure',
      client: 'CyberShield Financial Group',
      challenge: 'Legacy on-premise infrastructure lacked automated container scaling and had vulnerabilities against evolving DDoS attack vectors.',
      solution: 'Designed and deployed AWS Multi-Region Kubernetes clusters with automated GitOps CI/CD pipelines, Terraform IaC, and Zero-Trust mTLS security mesh.',
      results: [
        { value: '0', label: 'Security Vulnerabilities' },
        { value: '99.999%', label: 'High Availability Sells SLA' },
        { value: '4.2x', label: 'Feature Deployment Velocity' }
      ]
    }
  };

  $(document).ready(function () {

    // 1. SPA Smooth Scrolling with dynamic header offset
    function scrollToSection(targetId) {
      if (!targetId || targetId === '#' || targetId === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const headerHeight = $('.main-header').outerHeight() || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });

        if (history.replaceState) {
          history.replaceState(null, null, targetId);
        }
      }
    }

    // Intercept all in-page anchor links
    $(document).on('click', 'a[href^="#"]', function (e) {
      const href = $(this).attr('href');
      if (href && href.length > 1) {
        e.preventDefault();

        // Close mobile navbar if open
        if ($('.navbar-collapse').hasClass('show')) {
          $('.navbar-collapse').collapse('hide');
        }

        scrollToSection(href);
      } else if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(function () {
        scrollToSection(window.location.hash);
      }, 300);
    }

    // 2. ScrollSpy Navigation Highlighting
    const navSections = [
      'home',
      'about',
      'services',
      'projects',
      'process',
      'testimonials',
      'contact'
    ];

    function updateScrollSpy() {
      const scrollPos = $(window).scrollTop() + 150;

      navSections.forEach(function (id) {
        const section = document.getElementById(id);
        if (section) {
          const top = $(section).offset().top;
          const height = $(section).outerHeight();

          if (scrollPos >= top && scrollPos < top + height) {
            $('.navigation li').removeClass('current');
            $('.navigation a[href="#' + id + '"]').closest('li').addClass('current');
          }
        }
      });
    }

    $(window).on('scroll', updateScrollSpy);
    updateScrollSpy();

    // 5. Case Study Modal Data Injector
    $(document).on('click', '.btn-case-study', function (e) {
      e.preventDefault();
      const id = $(this).attr('data-case-id') || '1';
      const data = CASE_STUDIES[id];

      if (data) {
        $('#csModalTitle').text(data.title);
        $('#csModalCategory').text(data.category);
        $('#csModalClient').text(data.client);
        $('#csModalChallenge').text(data.challenge);
        $('#csModalSolution').text(data.solution);

        const statsContainer = $('#csModalStats');
        statsContainer.empty();
        data.results.forEach(function (stat) {
          statsContainer.append(`
            <div class="spa-modal-stat-item">
              <strong>${stat.value}</strong>
              <span>${stat.label}</span>
            </div>
          `);
        });

        const modalEl = document.getElementById('caseStudyModal');
        if (modalEl && window.bootstrap) {
          const bsModal = new bootstrap.Modal(modalEl);
          bsModal.show();
        }
      }
    });

    // 6. Contact & Proposal Form SPA Submission
    $('#contact-area-form').on('submit', function (e) {
      e.preventDefault();
      const form = $(this);
      const submitBtn = form.find('button[type="submit"]');
      const originalText = submitBtn.html();

      // Show spinner state
      submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i> Transmitting Proposal...');

      setTimeout(function () {
        submitBtn.prop('disabled', false).html(originalText);
        $('#formSuccessAlert').addClass('show');

        // Reset inputs
        form[0].reset();

        // Auto-dismiss alert after 6 seconds
        setTimeout(function () {
          $('#formSuccessAlert').removeClass('show');
        }, 6000);
      }, 1200);
    });

  });

})(jQuery);
