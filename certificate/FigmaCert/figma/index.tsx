import type { NextPage } from 'next';
import { useCallback } from 'react';
import Image from "next/image";
import {useRouter} from "next/router";
import styles from './index.module.css';

// Real assets from Figma
const imgLogo = "https://www.figma.com/api/mcp/asset/c44cc711-1b11-4a3c-b0db-50ef6e0d98f8";
const imgSearchIcon = "https://www.figma.com/api/mcp/asset/2eb85917-a263-45a8-a945-e3ae637b3b3d";
const imgSettingsIcon = "https://www.figma.com/api/mcp/asset/b7a54d44-a8ff-45d1-ac5e-27cb978fe4e1";
const imgAvatarUser = "https://www.figma.com/api/mcp/asset/008f0a8d-ce91-4b85-8fae-f4239befc5f7";
const imgSidebarDashboard = "https://www.figma.com/api/mcp/asset/925cfe66-8e6b-4ff7-b847-e701c77ddefb";
const imgSidebarTable = "https://www.figma.com/api/mcp/asset/f1fa8f6f-5af7-4096-aff7-1d5d8f5034aa";
const imgSidebarCalendar = "https://www.figma.com/api/mcp/asset/81166bb0-5f09-4a2b-a684-b7a5df4272ad";
const imgSidebarGroup = "https://www.figma.com/api/mcp/asset/a85c4ce6-93a1-4a37-87f3-46a266016773";
const imgSidebarMail = "https://www.figma.com/api/mcp/asset/a5f2cb48-4a31-41d3-948f-3eaf640fea3b";
const imgSidebarAdmin = "https://www.figma.com/api/mcp/asset/cf2b8e27-6637-4f58-a1e3-1fd86fc3872b";
const imgAvatar1 = "https://www.figma.com/api/mcp/asset/bfe05e01-5508-4652-be4c-e5037b40a8c3";
const imgAvatar2 = "https://www.figma.com/api/mcp/asset/b327d280-166e-4440-ab22-a0fb9d512104";
const imgEventAvatar1 = "https://www.figma.com/api/mcp/asset/9359d35a-5228-45fa-b5aa-3fe507808c03";
const imgEventAvatar2 = "https://www.figma.com/api/mcp/asset/4b790e37-15e1-4351-ad53-0cc34c5ac5c9";
const imgEventAvatar3 = "https://www.figma.com/api/mcp/asset/92059676-eafc-46ec-8c48-89f637ffc1fc";
const imgEventAvatar4 = "https://www.figma.com/api/mcp/asset/014f9d2d-c6c7-4765-804f-10f4128403cd";
const imgEventAvatar5 = "https://www.figma.com/api/mcp/asset/d2fa79b2-3516-4764-a8d4-010069df2e36";
const imgEventAvatar6 = "https://www.figma.com/api/mcp/asset/1e03abe8-f7a9-4eed-b9c9-191cbe9d4156";
const imgArrow = "https://www.figma.com/api/mcp/asset/3b12b055-5f3c-47fa-b051-1dc01bf3a238";
const imgArtwork = "https://www.figma.com/api/mcp/asset/d07114a7-026c-4830-9066-3bb3546e407b";
const imgTranslationIcon = "https://www.figma.com/api/mcp/asset/988d2e42-b92d-4890-91be-90846ad5e1b5";

const CertificateGenerationDashboard: NextPage = () => {
  	const router = useRouter();
  	
  	const onTablertableIconClick = useCallback(() => {
    		// Add your code here
  	}, []);
  	
  	
  	const onTablertableIconClick1 = useCallback(() => {
    		router.push("/");
  	}, [router]);
  	
  	return (
    		<div className={styles.certificateGenerationDashboa}>
      			<div className={styles.frameParent}>
        				<Image className={styles.frameChild} src={imgSearchIcon} width={23.6} height={23.6} sizes="100vw" alt="" />
        				<div className={styles.text}>
          					<div className={styles.search}>Search</div>
        				</div>
      			</div>
      			<Image className={styles.certificateGenerationDashboaChild} src={imgAvatarUser} width={44.8} height={44.8} sizes="100vw" alt="" />
      			<Image className={styles.sportskeyzWhite1} src={imgLogo} width={107} height={63} sizes="100vw" alt="" />
      			<div className={styles.menuBar}>
        				<div className={styles.menuBarChild} />
        				<div className={styles.groupParent}>
          					<div className={styles.frameGroup}>
            						<div className={styles.bxsdashboardParent}>
              							<Image className={styles.bxsdashboardIcon} src={imgSidebarDashboard} width={29.3} height={29.3} sizes="100vw" alt="" />
              							<Image className={styles.tablertableIcon} src={imgSidebarTable} width={29.3} height={29.3} sizes="100vw" alt="" onClick={onTablertableIconClick} />
              							<Image className={styles.tablertableIcon} src={imgSidebarCalendar} width={29.3} height={29.3} sizes="100vw" alt="" onClick={onTablertableIconClick1} />
              							<Image className={styles.groupIcon} src={imgSidebarGroup} width={29.3} height={29.3} sizes="100vw" alt="" onClick={onTablertableIconClick} />
              							<Image className={styles.frameItem} src={imgSidebarMail} width={27.5} height={20.1} sizes="100vw" alt="" onClick={onTablertableIconClick} />
              							<Image className={styles.clarityadministratorSolidIcon} src={imgSidebarAdmin} width={28} height={28} sizes="100vw" alt="" />
            						</div>
            						<div className={styles.groupChild} />
            						<div className={styles.frameContainer}>
              							<Image className={styles.frameInner} src={imgAvatar1} width={43} height={43} sizes="100vw" alt="" />
              							<Image className={styles.frameIcon} src={imgAvatar2} width={41.9} height={41.9} sizes="100vw" alt="" />
            						</div>
          					</div>
          					<div className={styles.academicParent}>
            						<div className={styles.academic}>Academic</div>
            						<div className={styles.academic}>Sports</div>
            						<div className={styles.academic}>Co-Curricular</div>
            						<div className={styles.academic}>Other</div>
          					</div>
        				</div>
      			</div>
      			<div className={styles.sportskeyzPoweredBy}>© 2026 SportsKeyz. Powered by SporTech Innovation. All rights reserved.</div>
      			<b className={styles.createCertificates}>Create Certificates</b>
      			<div className={styles.rectangleParent}>
        				<div className={styles.groupItem} />
        				<div className={styles.pastCertificatesCreatedParent}>
          					<div className={styles.pastCertificatesCreated}>Past Certificates Created</div>
          					<div className={styles.viewAllParent} onClick={onTablertableIconClick}>
            						<div className={styles.viewAll}>{`View All  `}</div>
            						<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
          					</div>
        				</div>
        				<div className={styles.frameWrapper}>
          					<div className={styles.frameDiv}>
            						<div className={styles.frameParent2}>
              							<Image className={styles.frameChild2} src={imgEventAvatar1} width={38} height={38} sizes="100vw" alt="" />
              							<div className={styles.nameOfThe}>Name of the event</div>
              							<div className={styles.nameOfThe}>Sport Name</div>
              							<div className={styles.nameOfThe}>Date</div>
              							<div className={styles.viewDetailsParent}>
                								<div className={styles.viewDetails}>{`View Details `}</div>
                								<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
              							</div>
            						</div>
            						<div className={styles.frameParent3}>
              							<Image className={styles.frameChild2} src={imgEventAvatar2} width={38} height={38} sizes="100vw" alt="" />
              							<div className={styles.nameOfThe}>Name of the event</div>
              							<div className={styles.nameOfThe}>Sport Name</div>
              							<div className={styles.nameOfThe}>Date</div>
              							<div className={styles.viewDetailsParent}>
                								<div className={styles.viewDetails}>{`View Details `}</div>
                								<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
              							</div>
            						</div>
            						<div className={styles.frameParent2}>
              							<Image className={styles.frameChild2} src={imgEventAvatar3} width={38} height={38} sizes="100vw" alt="" />
              							<div className={styles.nameOfThe}>Name of the event</div>
              							<div className={styles.nameOfThe}>Sport Name</div>
              							<div className={styles.nameOfThe}>Date</div>
              							<div className={styles.viewDetailsParent}>
                								<div className={styles.viewDetails}>{`View Details `}</div>
                								<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
              							</div>
            						</div>
            						<div className={styles.frameParent3}>
              							<Image className={styles.frameChild2} src={imgEventAvatar4} width={38} height={38} sizes="100vw" alt="" />
              							<div className={styles.nameOfThe}>Name of the event</div>
              							<div className={styles.nameOfThe}>Sport Name</div>
              							<div className={styles.nameOfThe}>Date</div>
              							<div className={styles.viewDetailsParent}>
                								<div className={styles.viewDetails}>{`View Details `}</div>
                								<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
              							</div>
            						</div>
            						<div className={styles.frameParent2}>
              							<Image className={styles.frameChild2} src={imgEventAvatar5} width={38} height={38} sizes="100vw" alt="" />
              							<div className={styles.nameOfThe}>Name of the event</div>
              							<div className={styles.nameOfThe}>Sport Name</div>
              							<div className={styles.nameOfThe}>Date</div>
              							<div className={styles.viewDetailsParent}>
                								<div className={styles.viewDetails}>{`View Details `}</div>
                								<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
              							</div>
            						</div>
            						<div className={styles.frameParent3}>
              							<Image className={styles.frameChild2} src={imgEventAvatar6} width={38} height={38} sizes="100vw" alt="" />
              							<div className={styles.nameOfThe}>Name of the event</div>
              							<div className={styles.nameOfThe}>Sport Name</div>
              							<div className={styles.nameOfThe}>Date</div>
              							<div className={styles.viewDetailsParent}>
                								<div className={styles.viewDetails}>{`View Details `}</div>
                								<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.groupInner} />
      			</div>
      			<div className={styles.rectangleGroup}>
        				<div className={styles.rectangleDiv} />
        				<div className={styles.liveUpdatesWrapper}>
          					<div className={styles.academic}>Live updates</div>
        				</div>
        				<div className={styles.upcomingTournaments}>Upcoming Tournaments</div>
        				<div className={styles.karnatakaBadmintonStateLeveParent}>
          					<div className={styles.karnatakaBadmintonState}>Karnataka Badminton State Level Tournament</div>
          					<div className={styles.bengaluruKarnataka}>Bengaluru, Karnataka</div>
          					<div className={styles.bengaluruKarnataka}>230 participants, 12 coaches, 10 officials, 21 volunteers</div>
          					<div className={styles.bengaluruKarnataka}>Tournament ID, Name, Organizer, Date, Location</div>
        				</div>
        				<div className={styles.viewAllEventsParent}>
          					<div className={styles.viewDetails}>{`View All Events `}</div>
          					<Image className={styles.downarrowIcon} src={imgArrow} width={20} height={20} sizes="100vw" alt="" />
        				</div>
        				<div className={styles.frameParent8}>
          					<div className={styles.firstWrapper}>
            						<div className={styles.first}>First</div>
          					</div>
          					<div className={styles.secondWrapper}>
            						<div className={styles.second}>Second</div>
          					</div>
          					<div className={styles.thirdWrapper}>
            						<div className={styles.second}>Third</div>
          					</div>
          					<div className={styles.fourthWrapper}>
            						<div className={styles.second}>Fourth</div>
          					</div>
        				</div>
      			</div>
      			<div className={styles.rectangleContainer}>
        				<div className={styles.frameChild8} />
        				<div className={styles.groupDiv}>
          					<div className={styles.groupChild2} />
          					<div className={styles.groupChild3} />
          					<div className={styles.div}>5289</div>
          					<div className={styles.certificatesCreated}>Certificates Created</div>
        				</div>
        				<div className={styles.rectangleParent2}>
          					<div className={styles.groupChild2} />
          					<div className={styles.groupChild5} />
          					<div className={styles.div}>16,211</div>
          					<div className={styles.certificatesCreated}>Certificates left</div>
        				</div>
        				<Image className={styles.frameChild9} src={imgArtwork} width={519.1} height={166} sizes="100vw" alt="" />
        				<div className={styles.frameParent9}>
          					<div className={styles.renewPackParent}>
            						<div className={styles.renewPack}>Renew Pack</div>
            						<div className={styles.renewYourPack}>Renew your pack to create more certificates.</div>
          					</div>
          					<div className={styles.renewWrapper}>
            						<div className={styles.renew}>Renew</div>
          					</div>
        				</div>
        				<div className={styles.frameChild10} />
        				<div className={styles.frameParent10}>
          					<div className={styles.generateNewCertificateParent}>
            						<div className={styles.renewPack}>Generate New Certificate</div>
            						<div className={styles.clickHereTo}>Click here to generate certificates for your upcoming tournament.</div>
          					</div>
          					<div className={styles.createWrapper} onClick={onTablertableIconClick}>
            						<div className={styles.create}>+ Create</div>
          					</div>
        				</div>
      			</div>
      			<div className={styles.frameParent11}>
        				<div className={styles.groupChild6} />
        				<Image className={styles.translationIcon2} src={imgTranslationIcon} width={51} height={51} sizes="100vw" alt="" />
      			</div>
    		</div>);
};

export default CertificateGenerationDashboard ;
