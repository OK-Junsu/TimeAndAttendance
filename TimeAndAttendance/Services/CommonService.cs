using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Services
{
    public class CommonService<T>(DataContext context, DbSet<T> table) where T : PostInfo
    {
        private readonly DataContext _context = context;


        /// <summary>
        /// 전체 목록 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<T>> GetAllItems() => await table.ToListAsync();
        /// <summary>
        /// 삭제되지 않은 목록 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<T>> GetNotDeletedItems()
        {
            var all = await GetAllItems();

            return [.. all.Where(e => !e.IsDeleted)];
        }
        /// <summary>
        /// 사용 가능한 다음 ID 요청
        /// </summary>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public async Task<int> GetNextId()
        {
            var largest = table.Any() ? await table.MaxAsync(e => e.Id) : 0;
            if (largest == int.MaxValue) throw new ArgumentException("The available ID range has been exceeded");

            return ++largest;
        }
        /// <summary>
        /// 항목 ID 로 조회
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<T?> GetItemById(int id) => await table.FindAsync(id);
        /// <summary>
        /// 항목 생성
        /// </summary>
        /// <param name="newItem"></param>
        /// <returns></returns>
        public async Task<T> PostItem(T newItem, bool isSoftPut = false)
        {
            if (isSoftPut)
            {
                newItem.OriginId = newItem.Id;
                newItem.Id = await GetNextId();
            }
            else
            {
                newItem.Id = await GetNextId();
                newItem.OriginId = newItem.Id;
            }

            table.Add(newItem);
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

            await PostItem(modifiedItem, true);

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

            table.Remove(existingItem);
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

            table.RemoveRange(items);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
