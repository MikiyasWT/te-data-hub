interface CaseFilter {
  subcity?: string;
  woreda?: string;
  ketena?: string;
  frombirthdate?: string | number | Date;
  tobirthdate?: string | number | Date;
  minimumAge?: number;
  maximumAge?: number;
  minimumChildren?: number;
  maximumChildren?: number;
  regionstate?: string;
  gender?: string;
}

interface filter {
  data: any;
  casefilter: CaseFilter;
}

export const dynamicFilter = (data: any[], casefilter: CaseFilter) => {
  console.log(casefilter);
  debugger;
  const filteredData = data.filter((item: any) => {
    // Check if regionstate is provided in casefilter object
    if (
      !("regionstate" in casefilter) ||
      (item.regionstate &&
        item.regionstate.toLowerCase() === casefilter.regionstate)
    ) {
      // Check if subcity is provided in casefilter object
      if (
        !("subcity" in casefilter) ||
        (item.subcity && item.subcity.toLowerCase() === casefilter.subcity)
      ) {
        // Check if woreda is provided in casefilter object
        if (!("woreda" in casefilter) || item.woreda === casefilter.woreda) {
          // Check if ketena is provided in casefilter object
          if (!("ketena" in casefilter) || item.ketena === casefilter.ketena) {
            // Calculate age from birth_date
            const birthDate = new Date(item.birth_date);
            const currentDate = new Date();
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            // Check if minimumAge is defined in casefilter object
            if (
              !("minimumAge" in casefilter) ||
              (casefilter.minimumAge !== undefined &&
                age >= casefilter.minimumAge)
            ) {
              // Check if maximumAge is defined in casefilter object
              if (
                !("maximumAge" in casefilter) ||
                (casefilter.maximumAge !== undefined &&
                  age <= casefilter.maximumAge)
              ) {
                // Filter by dependants count
                if (
                  !("minimumChildren" in casefilter) ||
                  (casefilter.minimumChildren !== undefined &&
                    item.dependants >= casefilter.minimumChildren)
                ) {
                  if (
                    !("maximumChildren" in casefilter) ||
                    (casefilter.maximumChildren !== undefined &&
                      item.dependants <= casefilter.maximumChildren)
                  ) {
                    // Check if frombirthdate is provided in casefilter object
                    if (
                      !("frombirthdate" in casefilter) ||
                      (casefilter.frombirthdate &&
                        birthDate >= new Date(casefilter.frombirthdate))
                    ) {
                      // Check if tobirthdate is provided in casefilter object
                      if (
                        !("tobirthdate" in casefilter) ||
                        (casefilter.tobirthdate &&
                          birthDate <= new Date(casefilter.tobirthdate))
                      ) {
                        // Check if gender is provided in casefilter object
                        if (
                          !("gender" in casefilter) ||
                          (casefilter.gender &&
                            item.gender?.toLowerCase() === casefilter.gender)
                        ) {
                          return true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  });

  return filteredData;
};






