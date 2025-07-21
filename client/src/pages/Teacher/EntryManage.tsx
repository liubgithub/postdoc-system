import { defineComponent } from 'vue';
import TeacherHeader from './TeacherHeader';

export default defineComponent({
  name: 'EntryManagePage',
  setup() {
    return () => (
      <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>
        <div style={{ height: '100px', background: '#0033cc' }}>
          <TeacherHeader />
        </div>
        <div style={{ padding: '32px' }}>
          <h2>进站管理</h2>
          <p>这里是进站管理页面内容。</p>
        </div>
      </div>
    );
  }
}); 