using Microsoft.EntityFrameworkCore;
using TAMBlazor.Data;
using TAMBlazor.Models;

namespace TAMBlazor.Services
{
    public class CommonService<T>(DataContext context, DbSet<T> table) where T : PostInfo
    {
        private readonly DataContext _context = context;
        private readonly DbSet<T> _table = table;


        /// <summary>
        /// 전체 목록 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<T>> GetAllItems() => await _table.ToListAsync();
        /// <summary>
        /// 삭제되지 않은 목록 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<T>> GetNotDeletedItems()
        {
            var allItems = await GetAllItems();

            return [.. allItems.Where(e => !e.IsDeleted)];
        }
        /// <summary>
        /// 사용 가능한 다음 ID 요청
        /// </summary>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public async Task<int> GetNextId()
        {
            var largestId = _table.Any() ? await _table.MaxAsync(e => e.Id) : 0;
            if (largestId == int.MaxValue) throw new ArgumentException("The available ID range has been exceeded");

            return ++largestId;
        }
        /// <summary>
        /// 항목 ID 로 조회
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<T?> GetItemById(int id) => await _table.FindAsync(id);
        /// <summary>
        /// 항목 생성
        /// </summary>
        /// <param name="newItem"></param>
        /// <returns></returns>
        public async Task<T?> PostItem(T newItem, bool isSoftPut = false)
        {
            newItem.Id = await GetNextId();
            newItem.CreatedAt = DateTime.Now;
            if (!isSoftPut) newItem.OriginId = newItem.Id;

            _table.Add(newItem);
            await _context.SaveChangesAsync();

            return newItem;
        }
        /// <summary>
        /// 소프트 수정
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        public async Task<bool> SoftPutItem(int id, T modifiedItem)
        {
            var succeeded = await SoftDeleteItem(id);
            if (!succeeded) return false;

            var originItem = await GetItemById(id);
            if (originItem == null) return false;

            modifiedItem.OriginId = originItem.OriginId;

            var post = await PostItem(modifiedItem, true);
            if (post == null) return false;

            return true;
        }
        /// <summary>
        /// 하드 수정
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        public async Task<bool> HardPutItem(int id, T modifiedItem)
        {
            if (id != modifiedItem.Id) return false;

            var existingItem = await GetItemById(id);
            if (existingItem == null || existingItem.IsDeleted) return false;

            existingItem.Overwrite(modifiedItem);

            _context.Entry(existingItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// 소프트 삭제
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> SoftDeleteItem(int id)
        {
            var existingItem = await GetItemById(id);
            if (existingItem == null || existingItem.IsDeleted) return false;

            existingItem.DeletedAt = DateTime.Now;

            _context.Entry(existingItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// 영구 삭제
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> HardDeleteItem(int id)
        {
            var existingItem = await GetItemById(id);
            if (existingItem == null) return false;

            _table.Remove(existingItem);
            await _context.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// 전체 목록 영구 삭제
        /// </summary>
        /// <returns></returns>
        public async Task<bool> HardDeleteAllItems()
        {
            var items = await GetAllItems();
            if (items == null) return false;

            _table.RemoveRange(items);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
