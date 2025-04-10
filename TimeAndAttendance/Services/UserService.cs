using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Services
{
    public class UserService(DataContext context)
    {
        /// <summary>
        /// 사용자 목록 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<User>> GetAllUsersAsync() => await context.Users.ToListAsync();
        /// <summary>
        /// 삭제되지 않은 사용자 목록 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<User>> GetNotDeletedUsersAsync() => await context.Users.Where(u => !u.IsDeleted).ToListAsync();
        public async Task<int> GetLargestId() => await context.Users.MaxAsync(e => e.Id);
        /// <summary>
        /// 사용자 조회
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<User?> GetUserByIdAsync(int id) => await context.Users.FindAsync(id);
        /// <summary>
        /// 사용자 생성
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<User> CreateUserAsync(User user)
        {
            context.Users.Add(user);
            await context.SaveChangesAsync();

            return user;
        }
        /// <summary>
        /// 사용자 소프트 수정
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> SoftPutUserAsync(int id, User user)
        {
            var succeeded = await SoftDeleteUserAsync(id);
            if (!succeeded) return false;

            user.Id = await GetLargestId() + 1;
            user.OriginId = id;
            await CreateUserAsync(user);

            return true;
        }
        /// <summary>
        /// 사용자 하드 수정
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> HardPutUserAsync(int id, User user)
        {
            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null || existingUser.IsDeleted) return false;

            existingUser.Name = user.Name;
            existingUser.JoiningDate = user.JoiningDate;
            existingUser.ResignationDate = user.ResignationDate;

            context.Entry(existingUser).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// 사용자 소프트 삭제
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> SoftDeleteUserAsync(int id)
        {
            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null || existingUser.IsDeleted) return false;

            existingUser.DeletedAt = DateTime.Now;

            context.Entry(existingUser).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return true;
        }
        /// <summary>
        /// 사용자 영구 삭제
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> HardDeleteUserAsync(int id)
        {
            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null) return false;

            context.Users.Remove(existingUser);
            await context.SaveChangesAsync();

            return true;
        }
    }
}
