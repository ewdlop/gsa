/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {parseSeverity, parseDate, setProperties} from 'gmp/parser';
import {
  parseCvssV2BaseFromVector,
  parseCvssV3BaseFromVector,
} from 'gmp/parser/cvss';
import {parseCvssV4MetricsFromVector} from 'gmp/parser/cvssV4';
import {map} from 'gmp/utils/array';
import {isArray, isDefined} from 'gmp/utils/identity';
import {isEmpty} from 'gmp/utils/string';

import Info from './info';

class Cve extends Info {
  static entityType = 'cve';

  static fromResultElement(element) {
    const ret = {};

    ret.name = element.name;
    ret.id = element.name;
    ret.epss = element.epss;

    return ret;
  }

  static parseElement(element) {
    const ret = super.parseElement(element, 'cve');

    if (isDefined(ret.update_time)) {
      ret.updateTime = parseDate(ret.update_time);
      delete ret.update_time;
    }
    ret.severity = parseSeverity(ret.severity);

    if (isDefined(ret.nvts)) {
      ret.nvts = map(ret.nvts.nvt, nvt => {
        return setProperties({
          ...nvt,
          id: nvt._oid,
          oid: nvt._oid,
        });
      });
    }

    if (isDefined(ret.cert)) {
      ret.certs = map(ret.cert.cert_ref, ref => {
        return {
          name: ref.name,
          title: ref.title,
          cert_type: ref._type,
        };
      });

      delete ret.cert;
    } else {
      ret.certs = [];
    }
    if (isEmpty(ret.cvss_vector)) {
      ret.cvss_vector = '';
    }
    if (ret.cvss_vector.includes('CVSS:4')) {
      const {AV, AC, AT, PR, UI, VC, VI, VA, SC, SI, SA} =
        parseCvssV4MetricsFromVector(ret.cvss_vector);
      ret.cvssAttackVector = AV;
      ret.cvssAttackComplexity = AC;
      ret.cvssAttackRequirements = AT;
      ret.cvssPrivilegesRequired = PR;
      ret.cvssUserInteraction = UI;
      ret.cvssConfidentialityVS = VC;
      ret.cvssIntegrityVS = VI;
      ret.cvssAvailabilityVS = VA;
      ret.cvssConfidentialitySS = SC;
      ret.cvssIntegritySS = SI;
      ret.cvssAvailabilitySS = SA;
    } else if (ret.cvss_vector.includes('CVSS:3')) {
      const {
        attackVector,
        attackComplexity,
        privilegesRequired,
        userInteraction,
        scope,
        confidentialityImpact,
        integrityImpact,
        availabilityImpact,
      } = parseCvssV3BaseFromVector(ret.cvss_vector);
      ret.cvssAttackVector = attackVector;
      ret.cvssAttackComplexity = attackComplexity;
      ret.cvssPrivilegesRequired = privilegesRequired;
      ret.cvssUserInteraction = userInteraction;
      ret.cvssScope = scope;
      ret.cvssConfidentialityImpact = confidentialityImpact;
      ret.cvssIntegrityImpact = integrityImpact;
      ret.cvssAvailabilityImpact = availabilityImpact;
    } else {
      const {
        accessVector,
        accessComplexity,
        authentication,
        confidentialityImpact,
        integrityImpact,
        availabilityImpact,
      } = parseCvssV2BaseFromVector(ret.cvss_vector);
      ret.cvssAccessVector = accessVector;
      ret.cvssAccessComplexity = accessComplexity;
      ret.cvssAuthentication = authentication;
      ret.cvssConfidentialityImpact = confidentialityImpact;
      ret.cvssIntegrityImpact = integrityImpact;
      ret.cvssAvailabilityImpact = availabilityImpact;
    }

    ret.cvssBaseVector = ret.cvss_vector;
    ret.products = isEmpty(ret.products) ? [] : ret.products.split(' ');

    if (isDefined(ret.raw_data) && isDefined(ret.raw_data.entry)) {
      const {entry} = ret.raw_data;

      ret.publishedTime = parseDate(entry['published-datetime']);
      ret.lastModifiedTime = parseDate(entry['last-modified-datetime']);

      ret.references = map(entry.references, ref => ({
        name: ref.reference.__text,
        href: ref.reference._href,
        source: ref.source,
        reference_type: ref._reference_type,
      }));

      if (
        isDefined(entry.cvss) &&
        isDefined(entry.cvss.base_metrics) &&
        isDefined(entry.cvss.base_metrics.source)
      ) {
        ret.source = entry.cvss.base_metrics.source;
      }

      if (isDefined(entry.summary)) {
        // really don't know why entry.summary and ret.description can differ
        // but xslt did use the summary and and e.g. the description of
        // CVE-2017-2988 was empty but summary not
        ret.description = entry.summary;
      }

      const products = entry['vulnerable-software-list'];
      if (isDefined(products)) {
        if (isDefined(products.product)) {
          ret.products = isArray(products.product)
            ? products.product
            : [products.product];
        } else {
          ret.products = [];
        }
      }

      delete ret.raw_data;
    } else {
      ret.references = [];
    }

    return ret;
  }
}

export default Cve;
