import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import { ElMessage } from 'element-plus'

// 基本信息表单接口
interface BasicForm {
  name?: string
  gender?: string
  birth_year?: string
  nationality?: string
  political_status?: string
  phone?: string
  education_experience: Array<{
    start?: string
    end?: string
    school?: string
    supervisor?: string
  }>
  work_experience: Array<{
    start?: string
    end?: string
    company?: string
  }>
  research_direction?: string
  other?: string
  otherachievements?: string
}

// 成就数据接口
interface AchievementData {
  paperList?: Array<Record<string, any>>
  patentList?: Array<Record<string, any>>
  awardList?: Array<Record<string, any>>
  projectList?: Array<Record<string, any>>
  conferenceList?: Array<Record<string, any>>
  bookList?: Array<Record<string, any>>
  standardList?: Array<Record<string, any>>
  varietyList?: Array<Record<string, any>>
  subjectResearchList?: Array<Record<string, any>>
}

/**
 * 导出个人信息为Word文档
 * @param form 基本信息表单数据
 * @param achievementData 成就数据
 * @param filename 导出文件名（可选，默认为"个人信息导出.docx"）
 */
export const exportPersonalInfo = async (
  form: BasicForm,
  achievementData: AchievementData,
  filename: string = "个人信息导出.docx"
): Promise<void> => {
  try {
    // 创建文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun("基本信息表")]
          }),
          // 基本信息表格
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("姓名")] }),
                  new TableCell({ children: [new Paragraph(form.name || "")] }),
                  new TableCell({ children: [new Paragraph("性别")] }),
                  new TableCell({ children: [new Paragraph(form.gender || "")] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("出生年")] }),
                  new TableCell({ children: [new Paragraph(form.birth_year || "")] }),
                  new TableCell({ children: [new Paragraph("国籍")] }),
                  new TableCell({ children: [new Paragraph(form.nationality || "")] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("政治面貌")] }),
                  new TableCell({ children: [new Paragraph(form.political_status || "")] }),
                  new TableCell({ children: [new Paragraph("电话")] }),
                  new TableCell({ children: [new Paragraph(form.phone || "")] })
                ]
              })
            ]
          }),
          
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            text: "教育经历",
            spacing: { before: 400 }
          }),
          
          // 教育经历表格
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("起止时间")] }),
                  new TableCell({ children: [new Paragraph("学校")] }),
                  new TableCell({ children: [new Paragraph("证明人")] })
                ]
              }),
              ...form.education_experience.map(edu => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(`${edu.start || ''} - ${edu.end || ''}`)] }),
                    new TableCell({ children: [new Paragraph(edu.school || '')] }),
                    new TableCell({ children: [new Paragraph(edu.supervisor || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            text: "工作经历",
            spacing: { before: 400 }
          }),
          
          // 工作经历表格
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("起止时间")] }),
                  new TableCell({ children: [new Paragraph("单位及职务")] })
                ]
              }),
              ...form.work_experience.map(work => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(`${work.start || ''} - ${work.end || ''}`)] }),
                    new TableCell({ children: [new Paragraph(work.company || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "研究方向",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Paragraph(form.research_direction || ""),

          new Paragraph({
            text: "其他说明",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Paragraph(form.other || ""),

          new Paragraph({
            text: "论文发表情况",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("论文名称")] }),
                  new TableCell({ children: [new Paragraph("刊物名称")] }),
                  new TableCell({ children: [new Paragraph("发表日期")] }),
                  new TableCell({ children: [new Paragraph("本人署名排序")] }),
                  new TableCell({ children: [new Paragraph("起始页号")] }),
                  new TableCell({ children: [new Paragraph("刊物级别")] }),
                  new TableCell({ children: [new Paragraph("是否共同第一")] }),
                  new TableCell({ children: [new Paragraph("通讯作者")] }),
                  new TableCell({ children: [new Paragraph("论文类型")] }),
                  new TableCell({ children: [new Paragraph("影响因子")] }),
                  new TableCell({ children: [new Paragraph("作者名单")] }),
                  new TableCell({ children: [new Paragraph("第一作者")] }),
                  new TableCell({ children: [new Paragraph("导师署名排序")] }),
                  new TableCell({ children: [new Paragraph("本校是否第一")] }),
                  new TableCell({ children: [new Paragraph("第一署名单位")] }),
                  new TableCell({ children: [new Paragraph("发表状态")] }),
                  new TableCell({ children: [new Paragraph("论文收录检索")] }),
                  new TableCell({ children: [new Paragraph("他引次数")] }),
                  new TableCell({ children: [new Paragraph("是否和学位论文相关")] }),
                  new TableCell({ children: [new Paragraph("出版号")] }),
                  new TableCell({ children: [new Paragraph("出版社")] }),
                  new TableCell({ children: [new Paragraph("总期号")] }),
                  new TableCell({ children: [new Paragraph("刊物编号")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.paperList || []).map(paper => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(paper.论文名称 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.刊物名称 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.发表日期 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.本人署名排序 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.起始页号 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.刊物级别 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.是否共同第一 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.通讯作者 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.论文类型 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.影响因子 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.作者名单 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.第一作者 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.导师署名排序 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.本校是否第一 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.第一署名单位 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.发表状态 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.论文收录检索 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.他引次数 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.是否和学位论文相关 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.出版号 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.出版社 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.总期号 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.刊物编号 || '')] }),
                    new TableCell({ children: [new Paragraph(paper.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "专利信息",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("专利名称")] }),
                  new TableCell({ children: [new Paragraph("专利类型")] }),
                  new TableCell({ children: [new Paragraph("申请日期")] }),
                  new TableCell({ children: [new Paragraph("授权日期")] }),
                  new TableCell({ children: [new Paragraph("专利号")] }),
                  new TableCell({ children: [new Paragraph("申请号")] }),
                  new TableCell({ children: [new Paragraph("发明人")] }),
                  new TableCell({ children: [new Paragraph("专利权人")] }),
                  new TableCell({ children: [new Paragraph("专利状态")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.patentList || []).map(patent => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(patent.专利成果名称 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.专利类型 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.提交时间 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.批准日期 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.授权公告号 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.申请编号 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.作者排名 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.专利权人 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.专利成果编码 || '')] }),
                    new TableCell({ children: [new Paragraph(patent.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "科技竞赛获奖情况",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("竞赛名称")] }),
                  new TableCell({ children: [new Paragraph("获奖类别")] }),
                  new TableCell({ children: [new Paragraph("获奖等级")] }),
                  new TableCell({ children: [new Paragraph("获奖时间")] }),
                  new TableCell({ children: [new Paragraph("本人署名")] }),
                  new TableCell({ children: [new Paragraph("获奖级别")] }),
                  new TableCell({ children: [new Paragraph("颁奖单位")] }),
                  new TableCell({ children: [new Paragraph("第一完成单位")] }),
                  new TableCell({ children: [new Paragraph("完成单位排名")] }),
                  new TableCell({ children: [new Paragraph("是否和学位论文相关")] }),
                  new TableCell({ children: [new Paragraph("奖项名称")] }),
                  new TableCell({ children: [new Paragraph("作者名单")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.awardList || []).map(award => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(award.竞赛名称 || '')] }),
                    new TableCell({ children: [new Paragraph(award.获奖类别 || '')] }),
                    new TableCell({ children: [new Paragraph(award.获奖等级 || '')] }),
                    new TableCell({ children: [new Paragraph(award.获奖时间 || '')] }),
                    new TableCell({ children: [new Paragraph(award.本人署名 || '')] }),
                    new TableCell({ children: [new Paragraph(award.获奖级别 || '')] }),
                    new TableCell({ children: [new Paragraph(award.颁奖单位 || '')] }),
                    new TableCell({ children: [new Paragraph(award.第一完成单位 || '')] }),
                    new TableCell({ children: [new Paragraph(award.完成单位排名 || '')] }),
                    new TableCell({ children: [new Paragraph(award.是否和学位论文相关 || '')] }),
                    new TableCell({ children: [new Paragraph(award.奖项名称 || '')] }),
                    new TableCell({ children: [new Paragraph(award.作者名单 || '')] }),
                    new TableCell({ children: [new Paragraph(award.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "参与项目情况",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("项目编号")] }),
                  new TableCell({ children: [new Paragraph("项目名称")] }),
                  new TableCell({ children: [new Paragraph("项目类型")] }),
                  new TableCell({ children: [new Paragraph("是否和学位论文相关")] }),
                  new TableCell({ children: [new Paragraph("项目标题")] }),
                  new TableCell({ children: [new Paragraph("立项日期")] }),
                  new TableCell({ children: [new Paragraph("项目层次")] }),
                  new TableCell({ children: [new Paragraph("参与人排名")] }),
                  new TableCell({ children: [new Paragraph("项目负责人")] }),
                  new TableCell({ children: [new Paragraph("本人承担部分")] }),
                  new TableCell({ children: [new Paragraph("项目来源")] }),
                  new TableCell({ children: [new Paragraph("其他资助情况")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.projectList || []).map(project => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(project.项目编号 || '')] }),
                    new TableCell({ children: [new Paragraph(project.项目名称 || '')] }),
                    new TableCell({ children: [new Paragraph(project.项目类型 || '')] }),
                    new TableCell({ children: [new Paragraph(project.是否和学位论文相关 || '')] }),
                    new TableCell({ children: [new Paragraph(project.项目标题 || '')] }),
                    new TableCell({ children: [new Paragraph(project.立项日期 || '')] }),
                    new TableCell({ children: [new Paragraph(project.项目层次 || '')] }),
                    new TableCell({ children: [new Paragraph(project.参与人排名 || '')] }),
                    new TableCell({ children: [new Paragraph(project.项目负责人 || '')] }),
                    new TableCell({ children: [new Paragraph(project.本人承担部分 || '')] }),
                    new TableCell({ children: [new Paragraph(project.项目来源 || '')] }),
                    new TableCell({ children: [new Paragraph(project.其他资助情况 || '')] }),
                    new TableCell({ children: [new Paragraph(project.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "学术会议情况",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("会议编号")] }),
                  new TableCell({ children: [new Paragraph("会议名称")] }),
                  new TableCell({ children: [new Paragraph("会议英文名")] }),
                  new TableCell({ children: [new Paragraph("主办单位")] }),
                  new TableCell({ children: [new Paragraph("会议举办形式")] }),
                  new TableCell({ children: [new Paragraph("会议等级")] }),
                  new TableCell({ children: [new Paragraph("国家或地区")] }),
                  new TableCell({ children: [new Paragraph("是否境外")] }),
                  new TableCell({ children: [new Paragraph("会议起始日")] }),
                  new TableCell({ children: [new Paragraph("会议终止日")] }),
                  new TableCell({ children: [new Paragraph("举办单位")] }),
                  new TableCell({ children: [new Paragraph("会议人数")] }),
                  new TableCell({ children: [new Paragraph("联系人电话")] }),
                  new TableCell({ children: [new Paragraph("会议地点")] }),
                  new TableCell({ children: [new Paragraph("会议报告")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.conferenceList || []).map(conf => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(conf.会议编号 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议名称 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议英文名 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.主办单位 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议举办形式 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议等级 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.国家或地区 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.是否境外 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议起始日 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议终止日 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.举办单位 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议人数 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.联系人电话 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议地点 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.会议报告 || '')] }),
                    new TableCell({ children: [new Paragraph(conf.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "著作信息",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("著作编号")] }),
                  new TableCell({ children: [new Paragraph("序号")] }),
                  new TableCell({ children: [new Paragraph("著作名")] }),
                  new TableCell({ children: [new Paragraph("丛书名")] }),
                  new TableCell({ children: [new Paragraph("出版社")] }),
                  new TableCell({ children: [new Paragraph("出版地")] }),
                  new TableCell({ children: [new Paragraph("出版日期")] }),
                  new TableCell({ children: [new Paragraph("ISBN")] }),
                  new TableCell({ children: [new Paragraph("字数(万字)")] }),
                  new TableCell({ children: [new Paragraph("第一作者")] }),
                  new TableCell({ children: [new Paragraph("本人是否第一作者")] }),
                  new TableCell({ children: [new Paragraph("本人排名")] }),
                  new TableCell({ children: [new Paragraph("共同作者")] }),
                  new TableCell({ children: [new Paragraph("书号")] }),
                  new TableCell({ children: [new Paragraph("语种")] }),
                  new TableCell({ children: [new Paragraph("所属二级学科代码")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.bookList || []).map(book => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(book.著作编号 || '')] }),
                    new TableCell({ children: [new Paragraph(book.序号 || '')] }),
                    new TableCell({ children: [new Paragraph(book.著作名 || '')] }),
                    new TableCell({ children: [new Paragraph(book.丛书名 || '')] }),
                    new TableCell({ children: [new Paragraph(book.出版社 || '')] }),
                    new TableCell({ children: [new Paragraph(book.出版地 || '')] }),
                    new TableCell({ children: [new Paragraph(book.出版日期 || '')] }),
                    new TableCell({ children: [new Paragraph(book.ISBN || '')] }),
                    new TableCell({ children: [new Paragraph(book['字数(万字)'] || '')] }),
                    new TableCell({ children: [new Paragraph(book.第一作者 || '')] }),
                    new TableCell({ children: [new Paragraph(book.本人是否第一作者 || '')] }),
                    new TableCell({ children: [new Paragraph(book.本人排名 || '')] }),
                    new TableCell({ children: [new Paragraph(book.共同作者 || '')] }),
                    new TableCell({ children: [new Paragraph(book.书号 || '')] }),
                    new TableCell({ children: [new Paragraph(book.语种 || '')] }),
                    new TableCell({ children: [new Paragraph(book.所属二级学科代码 || '')] }),
                    new TableCell({ children: [new Paragraph(book.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "行业标准制定",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("标准编号")] }),
                  new TableCell({ children: [new Paragraph("序号")] }),
                  new TableCell({ children: [new Paragraph("标准名称")] }),
                  new TableCell({ children: [new Paragraph("起草者")] }),
                  new TableCell({ children: [new Paragraph("本人是否第一起草者")] }),
                  new TableCell({ children: [new Paragraph("本人排名")] }),
                  new TableCell({ children: [new Paragraph("共同起草者")] }),
                  new TableCell({ children: [new Paragraph("标准级别")] }),
                  new TableCell({ children: [new Paragraph("发布日期")] }),
                  new TableCell({ children: [new Paragraph("实施日期")] }),
                  new TableCell({ children: [new Paragraph("发布机构")] }),
                  new TableCell({ children: [new Paragraph("标准号")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.standardList || []).map(standard => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(standard.标准编号 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.序号 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.标准名称 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.起草者 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.本人是否第一起草者 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.本人排名 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.共同起草者 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.标准级别 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.发布日期 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.实施日期 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.发布机构 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.标准号 || '')] }),
                    new TableCell({ children: [new Paragraph(standard.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "新品种培育",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("品种编号")] }),
                  new TableCell({ children: [new Paragraph("序号")] }),
                  new TableCell({ children: [new Paragraph("品种名称")] }),
                  new TableCell({ children: [new Paragraph("品种种类")] }),
                  new TableCell({ children: [new Paragraph("自主培育")] }),
                  new TableCell({ children: [new Paragraph("第一育种者")] }),
                  new TableCell({ children: [new Paragraph("本人是否第一育种者")] }),
                  new TableCell({ children: [new Paragraph("本人排名")] }),
                  new TableCell({ children: [new Paragraph("共同选育者")] }),
                  new TableCell({ children: [new Paragraph("登记年份")] }),
                  new TableCell({ children: [new Paragraph("公示年份")] }),
                  new TableCell({ children: [new Paragraph("登记状态")] }),
                  new TableCell({ children: [new Paragraph("登记编号")] }),
                  new TableCell({ children: [new Paragraph("选育单位")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.varietyList || []).map(variety => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(variety.品种编号 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.序号 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.品种名称 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.品种种类 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.自主培育 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.第一育种者 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.本人是否第一育种者 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.本人排名 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.共同选育者 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.登记年份 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.公示年份 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.登记状态 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.登记编号 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.选育单位 || '')] }),
                    new TableCell({ children: [new Paragraph(variety.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "课题研究信息",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("课题编号")] }),
                  new TableCell({ children: [new Paragraph("序号")] }),
                  new TableCell({ children: [new Paragraph("课题名称")] }),
                  new TableCell({ children: [new Paragraph("课题负责人")] }),
                  new TableCell({ children: [new Paragraph("本人是否负责人")] }),
                  new TableCell({ children: [new Paragraph("承担角色")] }),
                  new TableCell({ children: [new Paragraph("课题来源")] }),
                  new TableCell({ children: [new Paragraph("课题级别")] }),
                  new TableCell({ children: [new Paragraph("立项年份")] }),
                  new TableCell({ children: [new Paragraph("结题年份")] }),
                  new TableCell({ children: [new Paragraph("课题经费(万元)")] }),
                  new TableCell({ children: [new Paragraph("立项单位")] }),
                  new TableCell({ children: [new Paragraph("参加单位")] }),
                  new TableCell({ children: [new Paragraph("参加人员")] }),
                  new TableCell({ children: [new Paragraph("实施形式")] }),
                  new TableCell({ children: [new Paragraph("备注")] })
                ]
              }),
              ...(achievementData.subjectResearchList || []).map(research => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(research.课题编号 || '')] }),
                    new TableCell({ children: [new Paragraph(research.序号 || '')] }),
                    new TableCell({ children: [new Paragraph(research.课题名称 || '')] }),
                    new TableCell({ children: [new Paragraph(research.课题负责人 || '')] }),
                    new TableCell({ children: [new Paragraph(research.本人是否负责人 || '')] }),
                    new TableCell({ children: [new Paragraph(research.承担角色 || '')] }),
                    new TableCell({ children: [new Paragraph(research.课题来源 || '')] }),
                    new TableCell({ children: [new Paragraph(research.课题级别 || '')] }),
                    new TableCell({ children: [new Paragraph(research.立项年份 || '')] }),
                    new TableCell({ children: [new Paragraph(research.结题年份 || '')] }),
                    new TableCell({ children: [new Paragraph(research['课题经费(万元)'] || '')] }),
                    new TableCell({ children: [new Paragraph(research.立项单位 || '')] }),
                    new TableCell({ children: [new Paragraph(research.参加单位 || '')] }),
                    new TableCell({ children: [new Paragraph(research.参加人员 || '')] }),
                    new TableCell({ children: [new Paragraph(research.实施形式 || '')] }),
                    new TableCell({ children: [new Paragraph(research.备注 || '')] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({
            text: "其他成果",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          new Paragraph(form.otherachievements || "")
        ]
      }]
    })

    // 生成文档
    const blob = await Packer.toBlob(doc)
    saveAs(blob, filename)
    ElMessage.success("导出成功")
  } catch (error) {
    console.error("导出失败", error)
    ElMessage.error("导出失败：" + ((error as Error).message || "未知错误"))
    throw error
  }
}
