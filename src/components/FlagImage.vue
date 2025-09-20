<template>
  <component :is="componentName" />
</template>
<script>
import { defineComponent } from 'vue'

import FlagAD from '@/components/flags/AD.vue'
import FlagAE from '@/components/flags/AE.vue'
import FlagAF from '@/components/flags/AF.vue'
import FlagAG from '@/components/flags/AG.vue'
import FlagAI from '@/components/flags/AI.vue'
import FlagAL from '@/components/flags/AL.vue'
import FlagAM from '@/components/flags/AM.vue'
import FlagAO from '@/components/flags/AO.vue'
import FlagAR from '@/components/flags/AR.vue'
import FlagAS from '@/components/flags/AS.vue'
import FlagAT from '@/components/flags/AT.vue'
import FlagAU from '@/components/flags/AU.vue'
import FlagAW from '@/components/flags/AW.vue'
import FlagAX from '@/components/flags/AX.vue'
import FlagAZ from '@/components/flags/AZ.vue'
import FlagBA from '@/components/flags/BA.vue'
import FlagBB from '@/components/flags/BB.vue'
import FlagBD from '@/components/flags/BD.vue'
import FlagBE from '@/components/flags/BE.vue'
import FlagBF from '@/components/flags/BF.vue'
import FlagBG from '@/components/flags/BG.vue'
import FlagBH from '@/components/flags/BH.vue'
import FlagBI from '@/components/flags/BI.vue'
import FlagBJ from '@/components/flags/BJ.vue'
import FlagBL from '@/components/flags/BL.vue'
import FlagBM from '@/components/flags/BM.vue'
import FlagBN from '@/components/flags/BN.vue'
import FlagBO from '@/components/flags/BO.vue'
import FlagBQ from '@/components/flags/BQ.vue'
import FlagBR from '@/components/flags/BR.vue'
import FlagBS from '@/components/flags/BS.vue'
import FlagBT from '@/components/flags/BT.vue'
import FlagBW from '@/components/flags/BW.vue'
import FlagBY from '@/components/flags/BY.vue'
import FlagBZ from '@/components/flags/BZ.vue'
import FlagCA from '@/components/flags/CA.vue'
import FlagCC from '@/components/flags/CC.vue'
import FlagCD from '@/components/flags/CD.vue'
import FlagCF from '@/components/flags/CF.vue'
import FlagCG from '@/components/flags/CG.vue'
import FlagCH from '@/components/flags/CH.vue'
import FlagCI from '@/components/flags/CI.vue'
import FlagCK from '@/components/flags/CK.vue'
import FlagCL from '@/components/flags/CL.vue'
import FlagCM from '@/components/flags/CM.vue'
import FlagCN from '@/components/flags/CN.vue'
import FlagCO from '@/components/flags/CO.vue'
import FlagCR from '@/components/flags/CR.vue'
import FlagCU from '@/components/flags/CU.vue'
import FlagCV from '@/components/flags/CV.vue'
import FlagCW from '@/components/flags/CW.vue'
import FlagCX from '@/components/flags/CX.vue'
import FlagCY from '@/components/flags/CY.vue'
import FlagCZ from '@/components/flags/CZ.vue'
import FlagDE from '@/components/flags/DE.vue'
import FlagDJ from '@/components/flags/DJ.vue'
import FlagDK from '@/components/flags/DK.vue'
import FlagDM from '@/components/flags/DM.vue'
import FlagDO from '@/components/flags/DO.vue'
import FlagDZ from '@/components/flags/DZ.vue'
import FlagEC from '@/components/flags/EC.vue'
import FlagEE from '@/components/flags/EE.vue'
import FlagEG from '@/components/flags/EG.vue'
import FlagER from '@/components/flags/ER.vue'
import FlagES from '@/components/flags/ES.vue'
import FlagET from '@/components/flags/ET.vue'
import FlagFI from '@/components/flags/FI.vue'
import FlagFJ from '@/components/flags/FJ.vue'
import FlagFK from '@/components/flags/FK.vue'
import FlagFM from '@/components/flags/FM.vue'
import FlagFO from '@/components/flags/FO.vue'
import FlagFR from '@/components/flags/FR.vue'
import FlagGA from '@/components/flags/GA.vue'
import FlagGB from '@/components/flags/GB.vue'
import FlagGD from '@/components/flags/GD.vue'
import FlagGE from '@/components/flags/GE.vue'
import FlagGF from '@/components/flags/GF.vue'
import FlagGG from '@/components/flags/GG.vue'
import FlagGH from '@/components/flags/GH.vue'
import FlagGI from '@/components/flags/GI.vue'
import FlagGL from '@/components/flags/GL.vue'
import FlagGM from '@/components/flags/GM.vue'
import FlagGN from '@/components/flags/GN.vue'
import FlagGP from '@/components/flags/GP.vue'
import FlagGQ from '@/components/flags/GQ.vue'
import FlagGR from '@/components/flags/GR.vue'
import FlagGS from '@/components/flags/GS.vue'
import FlagGT from '@/components/flags/GT.vue'
import FlagGU from '@/components/flags/GU.vue'
import FlagGW from '@/components/flags/GW.vue'
import FlagGY from '@/components/flags/GY.vue'
import FlagHK from '@/components/flags/HK.vue'
import FlagHN from '@/components/flags/HN.vue'
import FlagHR from '@/components/flags/HR.vue'
import FlagHT from '@/components/flags/HT.vue'
import FlagHU from '@/components/flags/HU.vue'
import FlagID from '@/components/flags/ID.vue'
import FlagIE from '@/components/flags/IE.vue'
import FlagIM from '@/components/flags/IM.vue'
import FlagIN from '@/components/flags/IN.vue'
import FlagIQ from '@/components/flags/IQ.vue'
import FlagIR from '@/components/flags/IR.vue'
import FlagIS from '@/components/flags/IS.vue'
import FlagIT from '@/components/flags/IT.vue'
import FlagJE from '@/components/flags/JE.vue'
import FlagJM from '@/components/flags/JM.vue'
import FlagJO from '@/components/flags/JO.vue'
import FlagJP from '@/components/flags/JP.vue'
import FlagKE from '@/components/flags/KE.vue'
import FlagKG from '@/components/flags/KG.vue'
import FlagKH from '@/components/flags/KH.vue'
import FlagKI from '@/components/flags/KI.vue'
import FlagKM from '@/components/flags/KM.vue'
import FlagKN from '@/components/flags/KN.vue'
import FlagKP from '@/components/flags/KP.vue'
import FlagKR from '@/components/flags/KR.vue'
import FlagKW from '@/components/flags/KW.vue'
import FlagKY from '@/components/flags/KY.vue'
import FlagKZ from '@/components/flags/KZ.vue'
import FlagLA from '@/components/flags/LA.vue'
import FlagLB from '@/components/flags/LB.vue'
import FlagLC from '@/components/flags/LC.vue'
import FlagLI from '@/components/flags/LI.vue'
import FlagLK from '@/components/flags/LK.vue'
import FlagLR from '@/components/flags/LR.vue'
import FlagLS from '@/components/flags/LS.vue'
import FlagLT from '@/components/flags/LT.vue'
import FlagLU from '@/components/flags/LU.vue'
import FlagLV from '@/components/flags/LV.vue'
import FlagLY from '@/components/flags/LY.vue'
import FlagMA from '@/components/flags/MA.vue'
import FlagMC from '@/components/flags/MC.vue'
import FlagMD from '@/components/flags/MD.vue'
import FlagME from '@/components/flags/ME.vue'
import FlagMF from '@/components/flags/MF.vue'
import FlagMG from '@/components/flags/MG.vue'
import FlagMH from '@/components/flags/MH.vue'
import FlagMK from '@/components/flags/MK.vue'
import FlagML from '@/components/flags/ML.vue'
import FlagMM from '@/components/flags/MM.vue'
import FlagMN from '@/components/flags/MN.vue'
import FlagMO from '@/components/flags/MO.vue'
import FlagMP from '@/components/flags/MP.vue'
import FlagMQ from '@/components/flags/MQ.vue'
import FlagMR from '@/components/flags/MR.vue'
import FlagMS from '@/components/flags/MS.vue'
import FlagMT from '@/components/flags/MT.vue'
import FlagMU from '@/components/flags/MU.vue'
import FlagMV from '@/components/flags/MV.vue'
import FlagMW from '@/components/flags/MW.vue'
import FlagMX from '@/components/flags/MX.vue'
import FlagMY from '@/components/flags/MY.vue'
import FlagMZ from '@/components/flags/MZ.vue'
import FlagNA from '@/components/flags/NA.vue'
import FlagNC from '@/components/flags/NC.vue'
import FlagNE from '@/components/flags/NE.vue'
import FlagNF from '@/components/flags/NF.vue'
import FlagNG from '@/components/flags/NG.vue'
import FlagNI from '@/components/flags/NI.vue'
import FlagNL from '@/components/flags/NL.vue'
import FlagNO from '@/components/flags/NO.vue'
import FlagNP from '@/components/flags/NP.vue'
import FlagNR from '@/components/flags/NR.vue'
import FlagNU from '@/components/flags/NU.vue'
import FlagNZ from '@/components/flags/NZ.vue'
import FlagOM from '@/components/flags/OM.vue'
import FlagPA from '@/components/flags/PA.vue'
import FlagPE from '@/components/flags/PE.vue'
import FlagPF from '@/components/flags/PF.vue'
import FlagPG from '@/components/flags/PG.vue'
import FlagPH from '@/components/flags/PH.vue'
import FlagPK from '@/components/flags/PK.vue'
import FlagPL from '@/components/flags/PL.vue'
import FlagPM from '@/components/flags/PM.vue'
import FlagPN from '@/components/flags/PN.vue'
import FlagPR from '@/components/flags/PR.vue'
import FlagPT from '@/components/flags/PT.vue'
import FlagPW from '@/components/flags/PW.vue'
import FlagPY from '@/components/flags/PY.vue'
import FlagQA from '@/components/flags/QA.vue'
import FlagRE from '@/components/flags/RE.vue'
import FlagRO from '@/components/flags/RO.vue'
import FlagRS from '@/components/flags/RS.vue'
import FlagRU from '@/components/flags/RU.vue'
import FlagRW from '@/components/flags/RW.vue'
import FlagSA from '@/components/flags/SA.vue'
import FlagSB from '@/components/flags/SB.vue'
import FlagSC from '@/components/flags/SC.vue'
import FlagSD from '@/components/flags/SD.vue'
import FlagSE from '@/components/flags/SE.vue'
import FlagSG from '@/components/flags/SG.vue'
import FlagSH from '@/components/flags/SH.vue'
import FlagSI from '@/components/flags/SI.vue'
import FlagSJ from '@/components/flags/SJ.vue'
import FlagSK from '@/components/flags/SK.vue'
import FlagSL from '@/components/flags/SL.vue'
import FlagSM from '@/components/flags/SM.vue'
import FlagSN from '@/components/flags/SN.vue'
import FlagSO from '@/components/flags/SO.vue'
import FlagSR from '@/components/flags/SR.vue'
import FlagSS from '@/components/flags/SS.vue'
import FlagST from '@/components/flags/ST.vue'
import FlagSV from '@/components/flags/SV.vue'
import FlagSX from '@/components/flags/SX.vue'
import FlagSY from '@/components/flags/SY.vue'
import FlagSZ from '@/components/flags/SZ.vue'
import FlagTC from '@/components/flags/TC.vue'
import FlagTD from '@/components/flags/TD.vue'
import FlagTF from '@/components/flags/TF.vue'
import FlagTG from '@/components/flags/TG.vue'
import FlagTH from '@/components/flags/TH.vue'
import FlagTJ from '@/components/flags/TJ.vue'
import FlagTL from '@/components/flags/TL.vue'
import FlagTM from '@/components/flags/TM.vue'
import FlagTN from '@/components/flags/TN.vue'
import FlagTO from '@/components/flags/TO.vue'
import FlagTR from '@/components/flags/TR.vue'
import FlagTT from '@/components/flags/TT.vue'
import FlagTV from '@/components/flags/TV.vue'
import FlagTW from '@/components/flags/TW.vue'
import FlagTZ from '@/components/flags/TZ.vue'
import FlagUA from '@/components/flags/UA.vue'
import FlagUG from '@/components/flags/UG.vue'
import FlagUS from '@/components/flags/US.vue'
import FlagUY from '@/components/flags/UY.vue'
import FlagUZ from '@/components/flags/UZ.vue'
import FlagVA from '@/components/flags/VA.vue'
import FlagVC from '@/components/flags/VC.vue'
import FlagVE from '@/components/flags/VE.vue'
import FlagVG from '@/components/flags/VG.vue'
import FlagVI from '@/components/flags/VI.vue'
import FlagVN from '@/components/flags/VN.vue'
import FlagVU from '@/components/flags/VU.vue'
import FlagWF from '@/components/flags/WF.vue'
import FlagWS from '@/components/flags/WS.vue'
import FlagXK from '@/components/flags/XK.vue'
import FlagYE from '@/components/flags/YE.vue'
import FlagYT from '@/components/flags/YT.vue'
import FlagZA from '@/components/flags/ZA.vue'
import FlagZM from '@/components/flags/ZM.vue'
import FlagZW from '@/components/flags/ZW.vue'

export default defineComponent({
  components: {
    FlagAD,
    FlagAE,
    FlagAF,
    FlagAG,
    FlagAI,
    FlagAL,
    FlagAM,
    FlagAO,
    FlagAR,
    FlagAS,
    FlagAT,
    FlagAU,
    FlagAW,
    FlagAX,
    FlagAZ,
    FlagBA,
    FlagBB,
    FlagBD,
    FlagBE,
    FlagBF,
    FlagBG,
    FlagBH,
    FlagBI,
    FlagBJ,
    FlagBL,
    FlagBM,
    FlagBN,
    FlagBO,
    FlagBQ,
    FlagBR,
    FlagBS,
    FlagBT,
    FlagBW,
    FlagBY,
    FlagBZ,
    FlagCA,
    FlagCC,
    FlagCD,
    FlagCF,
    FlagCG,
    FlagCH,
    FlagCI,
    FlagCK,
    FlagCL,
    FlagCM,
    FlagCN,
    FlagCO,
    FlagCR,
    FlagCU,
    FlagCV,
    FlagCW,
    FlagCX,
    FlagCY,
    FlagCZ,
    FlagDE,
    FlagDJ,
    FlagDK,
    FlagDM,
    FlagDO,
    FlagDZ,
    FlagEC,
    FlagEE,
    FlagEG,
    FlagER,
    FlagES,
    FlagET,
    FlagFI,
    FlagFJ,
    FlagFK,
    FlagFM,
    FlagFO,
    FlagFR,
    FlagGA,
    FlagGB,
    FlagGD,
    FlagGE,
    FlagGF,
    FlagGG,
    FlagGH,
    FlagGI,
    FlagGL,
    FlagGM,
    FlagGN,
    FlagGP,
    FlagGQ,
    FlagGR,
    FlagGS,
    FlagGT,
    FlagGU,
    FlagGW,
    FlagGY,
    FlagHK,
    FlagHN,
    FlagHR,
    FlagHT,
    FlagHU,
    FlagID,
    FlagIE,
    FlagIM,
    FlagIN,
    FlagIQ,
    FlagIR,
    FlagIS,
    FlagIT,
    FlagJE,
    FlagJM,
    FlagJO,
    FlagJP,
    FlagKE,
    FlagKG,
    FlagKH,
    FlagKI,
    FlagKM,
    FlagKN,
    FlagKP,
    FlagKR,
    FlagKW,
    FlagKY,
    FlagKZ,
    FlagLA,
    FlagLB,
    FlagLC,
    FlagLI,
    FlagLK,
    FlagLR,
    FlagLS,
    FlagLT,
    FlagLU,
    FlagLV,
    FlagLY,
    FlagMA,
    FlagMC,
    FlagMD,
    FlagME,
    FlagMF,
    FlagMG,
    FlagMH,
    FlagMK,
    FlagML,
    FlagMM,
    FlagMN,
    FlagMO,
    FlagMP,
    FlagMQ,
    FlagMR,
    FlagMS,
    FlagMT,
    FlagMU,
    FlagMV,
    FlagMW,
    FlagMX,
    FlagMY,
    FlagMZ,
    FlagNA,
    FlagNC,
    FlagNE,
    FlagNF,
    FlagNG,
    FlagNI,
    FlagNL,
    FlagNO,
    FlagNP,
    FlagNR,
    FlagNU,
    FlagNZ,
    FlagOM,
    FlagPA,
    FlagPE,
    FlagPF,
    FlagPG,
    FlagPH,
    FlagPK,
    FlagPL,
    FlagPM,
    FlagPN,
    FlagPR,
    FlagPT,
    FlagPW,
    FlagPY,
    FlagQA,
    FlagRE,
    FlagRO,
    FlagRS,
    FlagRU,
    FlagRW,
    FlagSA,
    FlagSB,
    FlagSC,
    FlagSD,
    FlagSE,
    FlagSG,
    FlagSH,
    FlagSI,
    FlagSJ,
    FlagSK,
    FlagSL,
    FlagSM,
    FlagSN,
    FlagSO,
    FlagSR,
    FlagSS,
    FlagST,
    FlagSV,
    FlagSX,
    FlagSY,
    FlagSZ,
    FlagTC,
    FlagTD,
    FlagTF,
    FlagTG,
    FlagTH,
    FlagTJ,
    FlagTL,
    FlagTM,
    FlagTN,
    FlagTO,
    FlagTR,
    FlagTT,
    FlagTV,
    FlagTW,
    FlagTZ,
    FlagUA,
    FlagUG,
    FlagUS,
    FlagUY,
    FlagUZ,
    FlagVA,
    FlagVC,
    FlagVE,
    FlagVG,
    FlagVI,
    FlagVN,
    FlagVU,
    FlagWF,
    FlagWS,
    FlagXK,
    FlagYE,
    FlagYT,
    FlagZA,
    FlagZM,
    FlagZW
  },
  props: {
    code: { type: String, default: undefined }
  },
  computed: {
    componentName() {
      return this.code ? `Flag${this.code.toUpperCase()}` : undefined
    }
  }
})
</script>
