export const vviinnIndustry =
  localStorage.getItem("vviinn-industries") ?? "home-living";

const data = {
  "home-living": {
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.skAkdwLTQ0sfeqfMCHWRN3QmoNGjb6YEUr3Z5mt9wvXyl447EXTx7nYRIpCVSF6T65bo5BEbDsCyjCII5jpfNWVgmHzNWfm9ZZ1_4vPdl7QsdMfQ7RZ6zEdVwCGVkQr34OLmsrHrSwnVv22Lkf74X_0uEkh1AUZcyTC8lGzdV0rYaipBIg47yKx1MpK3QegaXwCNshuPPDbl9s_Y-tiGkBI2761fElDaEIXUkeWLvkwL3Y2pUO3CpfzDYdS6coS0blBq_yCfuw_u2bkJbakg2JOiGkFnUBA7bZcDaLhx7Yl7ofsVeObaRic77wJR9cIU4RVec26kPTXw2Wxi4sjfmg",
    productIdSimilarProducts: "590013-6",
    productIdCrossSelling: "598125",
    textSearchQuery: "Chair",
    filterValue: "Möbel > Schränke & Regale",
    description: "company: 'vviinn', site: 'widgets.vviinn.com'",
  },
  fashion: {
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjIwNywianRpIjoiMmU0OTY3OTgtYzk3NC00ODQ3LTkyYWItOTBkMTEyZGY5MTY2Iiwic2NvcGVzIjpbInZwciIsInZwcyIsInZwYyJdfQ.bH8WQkR3jBuDZ92F3WObgcKplh14ODZeiBCf5JDOJfucU75u4XaZOQrmsOaw1ouZbO9cW40sKw9ZICaP4Soi00AHrWPBGjuzZ0Yx17vwGFUtHgK5Zi9DAhd3R3PcRnbo7UIvUtANTGcExd5TQnrA07DtV99KThoQEYB2I8R8HXv46j-Abo2kHovd6fGwYC6FYT1QpXEsVa8QNZtcrB0yU1rK6da8aR5Nh3zYECIUL0ysdhRmOQxR_3zBUVrXJYB15vvOH4TjAG6jSMcvaLwzmmTzH9_A9kVLsP27cFK5YYoAx7_w0eBMhQv3yEaHrVXuMXQe2gFjvCat441_DvZWyg",
    productIdSimilarProducts: "2588009-1",
    productIdCrossSelling: "4165669-1",
    textSearchQuery: "taschen",
    filterValue: "Beauty > Düfte",
    description: "company: 'Vviinn Demo Company', site: 'Fashion Women 64K'",
  },
  "manufacturer-spare-parts": {
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjEyNCwianRpIjoiM2FhNmY4M2UtOWFhMC00MjI5LThlMTMtMWJlZGUxMjM5MTJmIiwic2NvcGVzIjpbInZwciIsInZwcyIsInZwYyJdfQ.ewubkDcxd1Griq-w31oPqGv-HjSGsGvw__Hj4DYXm-tIsr1DeqiYWRXQXMxLTc5aKSI_AIDLP8Xxx0UUMJwuUC9kMjO0HGtgczb96eCOy4aAYiCPdN5sRv2iJLxIKI6xUNkhBIJzY_O56Ido9y8senDyoVx01cZq3duHnd14g6OQty3nGtE2scl9cDAUwpQ9xOYhTiTV1nnJBBqNjqn9PQMf-UVBA0I3yOuQ826Ra_sMYRbKLOH5E6vkbvxvDMAZ3lVh_mDfmdtVCz58W-k04eNbiM1jfzEUOwPQMB1nBEMDZjHlWozi6fT-7yAYNls9qv6wvuw_ED1xaURSVeQooA",
    productIdSimilarProducts: "0010030000vr",
    productIdCrossSelling: "0010120001vr",
    textSearchQuery: "Schlitz",
    filterValue:
      "Essentra-DE-AT > Befestigungen > Stangen und Schrauben > Schrauben",
  },
};

export const vviinnToken = data[vviinnIndustry].token;
export const productIdSimilarProducts =
  data[vviinnIndustry].productIdSimilarProducts;
export const productIdCrossSelling = data[vviinnIndustry].productIdCrossSelling;
export const textSearchQuery = data[vviinnIndustry].textSearchQuery;
export const filterValue = data[vviinnIndustry].filterValue;
